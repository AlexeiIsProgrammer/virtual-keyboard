import data from './data/keys.json'

let keyboardState = 'caseDown'

async function getKeys () {
    return data
}

function resetVisibles () {
    const allKeyButtons = document.querySelectorAll('.keyboard .key > span > span')

    allKeyButtons.forEach(el => el.classList.remove('active'))
}


function createTextArea() {
    const textarea = document.createElement('textarea')
    textarea.className = 'textarea'
    textarea.rows = 10

    return textarea
}

function createKeyboard() {
    const keyboard = document.createElement('div')
    keyboard.className = 'keyboard'

    return keyboard
}

function createElement(element) {
    const createdElement = document.createElement('div')
    createdElement.className = `key ${element.name}`
    
    const rus = document.createElement('span')
    rus.className = 'rus'

    const caseDown = document.createElement('span')
    caseDown.className = 'caseDown'
    caseDown.innerHTML = element.rus.caseDown

    const shiftUp = document.createElement('span')
    shiftUp.className = 'shiftUp'
    shiftUp.innerHTML = element.rus.shiftUp

    const caps = document.createElement('span')
    caps.className = 'caps'
    caps.innerHTML = element.rus.caps

    const shiftCaps = document.createElement('span')
    shiftCaps.className = 'shiftCaps'
    shiftCaps.innerHTML = element.rus.shiftCaps

    rus.append(caseDown, shiftUp, caps, shiftCaps)

    const eng = document.createElement('span')
    eng.className = 'eng'

    const caseDownEng = document.createElement('span')
    caseDownEng.className = 'caseDown'
    caseDownEng.innerHTML = element.eng.caseDown

    const shiftUpEng = document.createElement('span')
    shiftUpEng.className = 'shiftUp'
    shiftUpEng.innerHTML = element.eng.shiftUp

    const capsEng = document.createElement('span')
    capsEng.className = 'caps'
    capsEng.innerHTML = element.eng.caps

    const shiftCapsEng = document.createElement('span')
    shiftCapsEng.className = 'shiftCaps'
    shiftCapsEng.innerHTML = element.eng.shiftCaps

    eng.append(caseDownEng, shiftUpEng, capsEng, shiftCapsEng)

    createdElement.append(rus, eng) 

    return createdElement
}

function insertAtCursor(myField, myValue) {
    const myFieldInner = myField

    if (document.selection) {
        myFieldInner.focus();
        const sel = document.selection.createRange();
        sel.text = myValue;
    }
    else if (myFieldInner.selectionStart || myFieldInner.selectionStart === '0') {
        const startPos = myFieldInner.selectionStart;
        const endPos = myFieldInner.selectionEnd;
        myFieldInner.value = myFieldInner.value.substring(0, startPos)
            + myValue
            + myFieldInner.value.substring(endPos, myFieldInner.value.length);

    } else {
        myFieldInner.value += myValue;
    }


}


let language = 'rus' 

function fillState () {
    resetVisibles()

    const letters = document.querySelectorAll(`.${language} .${keyboardState}`)
    letters.forEach(el => el.classList.add('active'))
}

getKeys().then( keysArr => {
    const textarea = createTextArea()

    textarea.addEventListener('keydown', (e) => {
        e.preventDefault()
    })

    const keyboard = createKeyboard()

    keysArr.forEach(keyElement => {
        keyboard.append(createElement(keyElement))
    })

    document.body.append(textarea, keyboard)

    fillState()

    window.addEventListener('keydown', (e) => {

        e.preventDefault()

        const elementName = document.querySelector(`.${e.code}`)
        elementName.classList.add('hovered')
    
        if(e.key === 'Control' && e.key === 'Alt') {
            console.log('Смена');
            language = language === 'rus' ? 'eng' : 'rus'
            fillState()
    
            return
        }
    
        if (e.code === 'CapsLock') {
    
            if(keyboardState === 'caps') {
                keyboardState = 'caseDown'
            } else if (keyboardState === 'shiftUp') {
                keyboardState = 'shiftCaps'
            }
            else {
                keyboardState = 'caps'
            }
            
            fillState()
        }
    
        if (e.key === 'Shift' && keyboardState !== 'shiftCaps') {
            keyboardState = keyboardState === 'caps' ? 'shiftCaps' : 'shiftUp'
            fillState()
        }

        //  Вставка значения

        const insertedValue = e.key

        insertAtCursor(textarea, insertedValue)
    })
    
    window.addEventListener('keyup', (e) => {
        const elementName = document.querySelector(`.${e.code}`)
        elementName.classList.remove('hovered')

        if (e.key === 'Shift') {
            keyboardState = keyboardState === 'shiftCaps' ? 'caps' : 'caseDown'
            fillState()
        }
    
    })

}).catch(e => {
    console.log(e);
})
