package gameObjects

import (
    "fmt"
    "strings"
    "math"
    "MonsterQuest/gameFight/blowList"
    "MonsterQuest/gameFight/fightBase"
    "MonsterQuest/gameObjectsBase"
    "MonsterQuest/gameObjectsFlags"
    "MonsterQuest/geometry"
    "MonsterQuest/consts"
    "MonsterQuest/utils"
    "MonsterQuest/dice"
)

type MobKind struct {
    gameObjectsBase.Kind
    name string
    base_hp int
    hp_inc dice.Dice
    description string
    blowList blowList.BlowLister
}

func (mk *MobKind) GetName() string {
    return mk.name
}

func (mk *MobKind) GetDescription() string {
    return mk.description
}

func (mk *MobKind) GenHP() int {
    return mk.base_hp + mk.hp_inc.Shake().Throw()
}

func (mk *MobKind) CreateDropCount() int {
    return 1
}

func CreateMobKind(name string, base_hp int, hp_inc, description, blowMethods, flagsStr string) *MobKind {
    added := make(map[string] bool)
    kind := MobKind{gameObjectsBase.NewKind(), name, base_hp, dice.CreateDice(hp_inc), description, blowList.NewBlowList()}
    kind.blowList.AddBlowMethods(blowMethods)
    for _, flagName := range strings.Split(flagsStr, "|") {
        if race, isExist := gameObjectsFlags.GetRaceFlag(flagName); isExist {
            kind.SetRace(race)
        } else {
            flag := gameObjectsFlags.GetFlag(flagName)
            added[flagName] = true
            if flag != nil {
                kind.Flags = append(kind.Flags, flag)
            }
        }
    }
    if !added["NEVER_MOVE"] {
        kind.AddFlag(gameObjectsFlags.GetFlag("CAN_MOVE"))
    }
    if !added["NEVER_BLOW"] {
        kind.AddFlag(gameObjectsFlags.GetFlag("CAN_BLOW"))
    }
    return &kind
}

type Mob struct {
    gameObjectsBase.ActiveObject
    walkingCycle int
}

func (m *Mob) GetDir() int {
    return m.Dir
}

func (m *Mob) SetDir(dir int) {
    m.Dir = dir
}

func (m *Mob) NotifyAboutCollision() {
    if m.Target == nil {
        m.chooseDir()
    }
}

func (m *Mob) GetType() string {
    return consts.MOB_TYPE
}

func (m *Mob) GetInfo() consts.JsonType {
    info := m.ActiveObject.GetInfo()
    info["type"] = consts.MOB_TYPE
    info["name"] = m.Kind.GetName()
    info["race"] = consts.RaceNameMapping[m.Kind.GetRace()]
    return info
}

func (m *Mob) GetFullInfo() consts.JsonType {
    info := m.MergeInfo(m.GetInfo())
    info["description"] = m.Kind.GetDescription()
    return info
}

var directions = [4]int {consts.NORTH_DIR, consts.SOUTH_DIR, consts.WEST_DIR, consts.EAST_DIR}

func (m *Mob) chooseDir() {
    newDir := m.Dir
    for newDir == m.Dir {
        newDir = directions[dice.Throw(4, 1) - 1]
    }
    m.Dir = newDir
}

func (m *Mob) chooseVerticalDir(dy float64) {
    var dir int
    if dy > 0 {
        dir = consts.SOUTH_DIR
    } else {
        dir = consts.NORTH_DIR
    }
    m.SetDir(dir)
}

func (m *Mob) chooseHorizontalDir(dx float64) {
    var dir int
    if dx > 0 {
        dir = consts.EAST_DIR
    } else {
        dir = consts.WEST_DIR
    }
    m.SetDir(dir)
}

func (m *Mob) goToTarget() {
    target := m.Target.GetCenter()
    dx := target.X - m.Center.X
    dy := target.Y - m.Center.Y
    adx := math.Abs(dx)
    ady := math.Abs(dy)
    eps := 0.2
    if adx > ady {
        if adx > eps {
            m.chooseHorizontalDir(dx)
        } else {
            m.chooseVerticalDir(dy)
        }
    } else {
        if ady > eps {
            m.chooseVerticalDir(dy)
        } else {
            m.chooseHorizontalDir(dx)
        }
    }
}

func (m *Mob) think() {
    if m.Target != nil {
        m.goToTarget()
    } else {
        m.walkingCycle++
        if m.walkingCycle == consts.MOB_WALKING_CYCLE_DURATION {
            dice.Shake()
            m.walkingCycle = 0
            m.chooseDir()
        }
    }
}

func (m *Mob) Do() {
    m.think()
    if !m.Killed() {
        m.DoWithObj(m)
    }
}

func (m *Mob) Attack() consts.JsonType {
    var res consts.JsonType = nil
    if target, exists := m.GetTarget(); exists && target.GetID() != m.GetID() {
        m.ClearAttackPoint()
        bl := m.Kind.(*MobKind).blowList
        t, _ := m.GetTarget()
        if d := geometry.Distance(m.GetCenter(), t.GetCenter()); d <= m.GetAttackRadius() {
            // fmt.Printf("dist %f, attack radius %f\n", geometry.Distance(m.GetCenter(), t.GetCenter()), m.GetAttackRadius())
            // fmt.Printf("mob %d attack obj race - %d, id - %d\n", m.GetID(), t.GetKind().GetRace(), t.GetID())
            res = t.GetHit(bl.ChooseBlowMethod(consts.BT_MELEE), m)
            res["attacker"] = m.GetID()
            res["target"] = t.GetID()
        }
    }
    return res
}

func (m *Mob) GetHit(blow fightBase.Blower, attacker gameObjectsBase.Activer) consts.JsonType {
    res := m.ActiveObject.GetHit(blow, attacker)
    if t, isExist := m.GetTarget(); isExist {
        if t.GetType() != consts.PLAYER_TYPE {
            if attacker.GetType() == consts.PLAYER_TYPE {
                m.SetTarget(attacker)
            } else {
                dice.Shake()
                ary := [2]gameObjectsBase.Activer{t, attacker}
                m.SetTarget(ary[dice.Throw(2, 1) - 1])
            }
        }
    } else {
        m.SetTarget(attacker)
    }
    return res
}

func (m *Mob) createDrop(depth int64) {
    var (
        created_d = 0
        number int = m.Kind.CreateDropCount()
    )
    number = 4;
    if gens, has_gens := gameObjectsBase.ItemGens(depth); has_gens {
        for _, gen := range *gens {
            r := utils.Randint0(100)
            if r >= gen.Probability() {
                continue;
            }
            created_d++
            m.AddItem(gen.GenItem(m))
            if created_d == number {
                break;
            }
        }
    }
}

func NewMob(kind *MobKind, x, y float64, depth int64) *Mob {
    m := Mob{gameObjectsBase.NewActiveObject(-1, x, y, kind), 0}
    m.SetCharacteristic(consts.CHARACTERISTIC_HP, kind.GenHP())
    m.chooseDir()
    m.createDrop(int64(depth))
    return &m
}

func NewTestMob(x, y float64, race int, damage string, flags [] interface{}) *Mob {
    // "25d2", "CLAW|HURT|1d1"
    kind := MobKind{gameObjectsBase.NewKind(), "", 0, dice.CreateDice(consts.DEFAULT_DICE), "", blowList.NewBlowList()}
    kind.blowList.AddBlowMethods(fmt.Sprintf("HIT|HURT|%s", damage))
    // kind := gameObjectsBase.NewKind()
    kind.SetRace(race)
    for _, flag := range flags {
        kind.AddFlag(gameObjectsFlags.GetFlag(flag.(string)))
    }
    return &Mob{gameObjectsBase.NewActiveObject(-1, x, y, &kind), 5}
 }
