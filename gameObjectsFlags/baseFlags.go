package gameObjectsFlags

import (
    //"fmt"
    "math"
    "MonsterQuest/gameMap"
    "MonsterQuest/geometry"
    "MonsterQuest/gameObjectsBase"
    "MonsterQuest/consts"
    "MonsterQuest/notifier"
)

type Flag struct {
    field *gameMap.GameField
    MsgsChannel chan consts.JsonType
}

type MoveFlag struct {
    Flag
}

func (m *MoveFlag) checkCollisionWithWalls(obj gameObjectsBase.Activer, dir int, shift float64) (bool, geometry.Point) {
    pos := obj.GetShiftedFrontSide(dir, shift)
    if m.field.IsBlocked(int(math.Floor(pos.X)), int(math.Floor(pos.Y))) {
        switch dir {
        case consts.NORTH_DIR:
            pos.Y = math.Ceil(pos.Y) + consts.OBJECT_HALF
        case consts.SOUTH_DIR:
            pos.Y = math.Floor(pos.Y) - consts.OBJECT_HALF
        case consts.EAST_DIR:
            pos.X = math.Floor(pos.X) - consts.OBJECT_HALF
        case consts.WEST_DIR:
            pos.X = math.Ceil(pos.X) + consts.OBJECT_HALF
        }
        return false, pos
    }
    eps := consts.SLIDE_THRESHOLD
    side, pos := obj.GetCollisionableSide(dir, shift)
    res1 := m.field.IsBlocked(int(side.Point1.X), int(side.Point1.Y))
    res2 := m.field.IsBlocked(int(side.Point2.X), int(side.Point2.Y))
    var near float64
    if res1 || res2 {
        switch dir {
        case consts.NORTH_DIR, consts.SOUTH_DIR:
            if res1 {
                near = math.Ceil(side.Point1.X) - side.Point1.X
            } else {
                near = math.Floor(side.Point1.X) - side.Point1.X
            }
            if math.Abs(near) <= eps {
                side.Point1.X = side.Point1.X + near
                side.Point2.X = side.Point2.X + near
            } else {
                return false, obj.GetCenter()
            }
            pos.X = (side.Point1.X + side.Point2.X) / 2
        case consts.EAST_DIR, consts.WEST_DIR:
            if res1 {
                near = math.Ceil(side.Point1.Y) - side.Point1.Y
            } else {
                near = math.Floor(side.Point1.Y) - side.Point1.Y
            }
            if math.Abs(near) <= eps {
                side.Point1.Y = side.Point1.Y + near
                side.Point2.Y = side.Point2.Y + near
            } else {
                return false, obj.GetCenter()
            }
            pos.Y = (side.Point1.Y + side.Point2.Y) / 2
        }
    }
    return true, pos
}

func (m *MoveFlag) checkCollisionWithActorsInCell(col, row int, segment *geometry.Segment) bool {
    res := false
    for _, actor := range m.field.GetActors(col, row) {
        r := actor.GetRectangle()
        res = res || r.StrongCrossedBySegment(segment)
    }
    return res
}

func (m *MoveFlag) checkCollisionWithActors(obj gameObjectsBase.Activer, dir int, shift float64) (bool, geometry.Point) {
    segment, pos := obj.GetCollisionableSide(dir, shift)
    col1, row1 := int(segment.Point1.X), int(segment.Point1.Y)
    col2, row2 := int(segment.Point2.X), int(segment.Point2.Y)
    res := m.checkCollisionWithActorsInCell(col1, row1, &segment) || m.checkCollisionWithActorsInCell(col2, row2, &segment)
    if res {
        pos = obj.GetCenter()
    }
    return res, pos
}

func (m *MoveFlag) calcNewCenterForActor(obj gameObjectsBase.Activer, dir int, shift float64) (bool, geometry.Point) {
    collisionOccured := false
    noCollisionWithWall, res := m.checkCollisionWithWalls(obj, dir, shift)
    if noCollisionWithWall {
        collisionWithActorOccured, alternativeRes := m.checkCollisionWithActors(obj, dir, shift)
        if collisionWithActorOccured {
            res = alternativeRes
            collisionOccured = true
        }
    } else {
        collisionOccured = true
    }
    return collisionOccured, res
}

func (m *MoveFlag) Do(obj gameObjectsBase.Activer) {
    dir := obj.GetDir()
    if dir == -1 {
        return
    }
    var newCenter geometry.Point
    collisionOccured := false
    shift := consts.VELOCITY
    passed := 0.0
    m.field.UnlinkFromCells(obj)
    for passed + consts.OBJECT_HALF < shift && !collisionOccured {
        collisionOccured, newCenter = m.calcNewCenterForActor(obj, dir, consts.OBJECT_HALF)
        obj.ForcePlace(newCenter)
        passed += consts.OBJECT_HALF
    }
    if shift - passed > 0 && !collisionOccured {
        collisionOccured, newCenter = m.calcNewCenterForActor(obj, dir, shift - passed)
        obj.ForcePlace(newCenter)
    }
    m.field.LinkToCells(obj)
    if collisionOccured {
        obj.NotifyAboutCollision()
    }
}

type BlowFlag struct {
    Flag
}

func (a *BlowFlag) Do(obj gameObjectsBase.Activer) {
    if obj.ReadyAttack() {
        p := obj.GetAttackPoint()
        if p != nil && !a.field.OutOfRange(int(p.X), int(p.Y)) {
            for _, actor := range a.field.GetActors(int(p.X), int(p.Y)) {
                r := actor.GetRectangle()
                if r.In(p) {
                    obj.SetTarget(actor)
                    break
                }
            }
            // obj.ClearAttackPoint()
        }
        if target, exists := obj.GetTarget(); exists || p != nil {
            msg := obj.Attack()
            obj.ZeroCooldown()
            if msg != nil {
                notifier.GameNotifier.NotifyAboutAttack(obj, target, msg)
            }
        }
        // if target, exists := obj.GetTarget(); exists && target.GetID() != obj.GetID() {
        //     msg := obj.Attack()
        //     obj.ZeroCooldown()
        //     if msg != nil {
        //         notifier.GameNotifier.NotifyAboutAttack(obj, target, msg)
        //     }
        // }
    } else {
        obj.IncCooldownCounter()
    }
}

type HateFlag struct {
    Flag
    hated int
}

func (h *HateFlag) Do(obj gameObjectsBase.Activer) {
    if _, exists := obj.GetTarget(); exists {
        return
    }
    center := obj.GetCenter()
    lt, rb := h.field.GetSquareArea(center.X, center.Y, obj.GetRadiusVision())
    for i := int(lt.Y); i <= int(rb.Y); i++ {
        for j := int(lt.X); j <= int(rb.X); j++ {
            for _, m := range h.field.GetActors(j, i) {
                if m.GetKind().GetRace() == h.hated && obj.GetID() != m.GetID() {
                    obj.SetTarget(m)
                    return
                }
            }
        }
    }
}

type ReviveFlag struct {
    Flag
}

func (r *ReviveFlag) Do(obj gameObjectsBase.Activer) {
    if obj.Killed() && obj.GetRevivePoint() != nil {
        r.field.UnlinkFromCells(obj)
        obj.Revive()
        r.field.LinkToCells(obj)
    }
}