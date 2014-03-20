package engine

import (
    "bufio"
    "os"
    "MonsterQuest/MonsterQuest/consts"
)

type gameField struct {
    width, height int
    field []string
    players [][]map[string]bool
}

func (f *gameField) loadFromFile(fileName string, ml *mobList) {
    file, _ := os.Open(consts.PATH_TO_MAPS + fileName)
    defer file.Close()
    reader := bufio.NewReader(file)
    read := true
    i := 0
    for ; read ; {
        line, _, err := reader.ReadLine()
        f.field[i] = string(line)
        for j := 0; j < len(line); j++ {
            if line[j] == 'M' {
                ml.addMob(float64(j), float64(i))
            }
        }
        read = err == nil
        i++
        if len(line) > 0 && f.width == 0 {
            f.width = len(line)
        }
    }
    f.height = i
}

func (f *gameField) isBlocked(col, row int) bool {
    if col < 0 || col >= f.width || row < 0 || row >= f.height {
        return true
    } else {
        return f.field[row][col] == '#'
    }
}
