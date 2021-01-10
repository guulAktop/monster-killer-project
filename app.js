const ATTACK_VALUE = 10
const STRONG_ATTACK_VALUE = 17
const MONSTER_ATTACK_VALUE = 14
const HEAL_VALUE = 20

const MODE_ATTACK = 'ATTACK'
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK'
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK'
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK'
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL'
const LOG_EVENT_GAME_OVER = 'GAME_OVER'






let battleLog = []
let lastLoggedEnty

function getMaxLifeValues() {
    const enteredValue = prompt('Maximum  life for you and the monster', '100')

    let parsedValue = parseInt(enteredValue)
    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw { message: 'Invalid user input, not a number' }
    }
    return parsedValue
}

let choseMaxLife

try {
    choseMaxLife = getMaxLifeValues()
} catch (error) {
    console.log(error)
    choseMaxLife = 100
    alert('You entered something wrong, default value of 100 was used')
    // throw error
} finally {

}


let currentMonsterHealth = choseMaxLife
let currentPlayerHealth = choseMaxLife
let hasBonusLife = true


adjustHealthBars(choseMaxLife)


function writeLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    }
    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER'
            break
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event: ev,
                value: val,
                target: 'MONSTER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }
            break
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event: ev,
                value: val,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }
            break
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
                event: ev,
                value: val,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }
            break
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: ev,
                value: val,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }
            break
        default:
            logEntry = {}
    }
    //IF STATEMENTS
    // if (ev === LOG_EVENT_PLAYER_ATTACK) {
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'MONSTER',
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     }
    //     battleLog.push(logEntry)
    // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'PLAYER',
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     }
    //     battleLog.push(logEntry)
    // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'PLAYER',
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     }
    //     battleLog.push(logEntry)
    // }else if(ev === LOG_EVENT_GAME_OVER){
    //     logEntry = {
    //         event :ev,
    //         value: val,
    //         finalMonsterHealth : monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     }
    // }
    battleLog.push(logEntry)
}

function reset() {
    currentMonsterHealth = choseMaxLife
    currentPlayerHealth = choseMaxLife
    resetGame(choseMaxLife)

}


function endRound() {
    const initialPlayerHealth = currentPlayerHealth
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
    currentPlayerHealth -= playerDamage
    writeLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth)

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false
        removeBonusLife()
        currentPlayerHealth = initialPlayerHealth
        alert("You would be dead but the bonus life saved you!")
        setPlayerHealth()
    }
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("You Won!")
        writeLog(LOG_EVENT_MONSTER_ATTACK, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth)
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("You Lost!")
        writeLog(LOG_EVENT_MONSTER_ATTACK, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth)
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert("You have a draw!")
        writeLog(LOG_EVENT_MONSTER_ATTACK, 'A DRAW', currentMonsterHealth, currentPlayerHealth)
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
}

function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE
    const logEvent = mode === MODE_ATTACK
        ? LOG_EVENT_PLAYER_ATTACK
        : LOG_EVENT_PLAYER_STRONG_ATTACK
    //if (mode === 'ATTACK') {
    //   maxDamage = ATTACK_VALUE
    //    logEvent = LOG_EVENT_PLAYER_ATTACK
    // } else if (mode == 'STRONG_ATTACK') {
    //   maxDamage = STRONG_ATTACK_VALUE
    //    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK
    //}
    const damage = dealMonsterDamage(maxDamage)
    currentMonsterHealth -= damage
    endRound()
}

function attackHandler() {
    attackMonster('ATTACK')

}
function strongAttackHandler() {
    attackMonster('STRONG_ATTACK')
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= choseMaxLife - HEAL_VALUE) {
        alert("You cant heal to more to than your max initial health")
        healValue = choseMaxLife - currentPlayerHealth
    } else {
        healValue = HEAL_VALUE
    }
    increasePlayerHealth(HEAL_VALUE)
    currentPlayerHealth += healValue
    writeLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth)
    endRound()
}

function printLogHandler() {

    for (let i = 0; i < 3; i++) {
        console.log('__________________')
    }
    let j = 3
    outerWhile: do {
        console.log('Outer', j)
        innerFor: for (let k = 0; k < 5; k++) {
            if (k === 3) {
                //  break outerWhile
                continue outerWhile //dangerous => infinite loop
            }
        }
        console.log('Inner', k)
    } while (j < 3)

    // let j = 0
    // while(j < 3) {
    //     console.log('__________________')
    //     j++
    // }
    // for ( let i =10; i>0;){
    //     console.log(i)
    // }
    // for( let i =0; i < battleLog.length ; i++){
    //     console.log(battleLog[i])
    // }
    let i = 0
    for (const logEntry of battleLog) {
        if (!lastLoggedEnty && lastLoggedEnty !== 0 || lastLoggedEnty === i) {
            console.log(`${i}`)
            for (const key in logEntry) {
                console.log(key)
                console.log(logEntry[key])
            }
            lastLoggedEnty = i
            break
        }

        i++
    }
}

attackBtn.addEventListener("click", attackHandler)
strongAttackBtn.addEventListener("click", strongAttackHandler)
healBtn.addEventListener("click", healPlayerHandler)
logBtn.addEventListener('click', printLogHandler)