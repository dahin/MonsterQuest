define({
    TILE_SIZE: 32,
    playerVelocity: 1.0,
    slideThreshold: 0.1,
    ticksPerSecond: 60,
    screenRowCount: 7,
    screenColumnCount: 9,
    inventory_size : {x : 20, y : 10},
    slots : [
        "head_slot",
        "neck_slot",
        //"shoulder_slot",
        "chest_slot",
        "hands_slot",
        "finger_slot",
        "finger_slot",
        
        "weapon_slot",
        "shield_slot",
        //"back_slot",
        //"bow_slot",
        
        "feet_slot",
        "ammo_slot"
        
        
        
        //"legs_slot",
        
        //"relic_slot",
        
        //"shirt_slot",
        
        //"tabard_slot",
        //"trinket_slot",
        //"waist_slot",
        
        //"wrists_slot"
    ],
    quickpanel : {
        size : 10
    },
    trackbar : {
        position : {x : 100, y : 100},
        bar_position : {
            x : 20,
            y : 40
        }
    },
    xpbar : {
        size : 10, // in blocks
        height : 18,
        height_of_color_line : 11,
        offset : 3,
    },
    chrwind : {
        start : {x : 20, y : 3},
        offset : 16,
        position : {x : 100, y : 100},
    }

})