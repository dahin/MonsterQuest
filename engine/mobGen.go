package engine

import (
    "time"
    "MonsterQuest/geometry"
    "MonsterQuest/gameObjects"
    "MonsterQuest/consts"
    "MonsterQuest/dice"
)

type mobGenerator struct {
    kinds *[]*gameObjects.MobKind
    area *geometry.Rectangle
    depth int64
    respawnDuration time.Duration
    pipeline chan *gameObjects.Mob
}

func (gen *mobGenerator) run() {
    field := &GetInstance().field
    d := dice.NewDice(len(*gen.kinds), 1)
    amount := 0
    for {
        var x, y float64
        var placeFound = false
        for i := int(gen.area.LeftTop.Y); i <= int(gen.area.RightBottom.Y) && !placeFound; i++ {
            for j := int(gen.area.LeftTop.X); j <= int(gen.area.RightBottom.X) && !placeFound; j++ {
                if field.IsFree(j, i) {
                    x = float64(j) + consts.OBJECT_HALF
                    y = float64(i) + consts.OBJECT_HALF
                    placeFound = true
                }
            }
        }
        if placeFound {
            amount++
            if amount % 10 == 0 {
                amount = 0
                d.Shake()
            }
            gen.pipeline <- gameObjects.NewMob((*gen.kinds)[d.Throw() - 1], x, y, gen.depth)
        }
        time.Sleep(gen.respawnDuration)
    }
}

func NewMobGenerator(kinds *[]*gameObjects.MobKind, area *geometry.Rectangle, depth int64, respawnDuration float64, pipeline chan *gameObjects.Mob) *mobGenerator {
    return &mobGenerator{kinds, area, depth, time.Duration(respawnDuration) * time.Second, pipeline}
}
