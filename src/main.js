import data from './data/keys.json'

let keyboardState = 'caseDown'
let textarea

async function getKeys() {
    return data
}

function addDescription() {
    const OS = document.createElement('p')
    const changeLanguage = document.createElement('p')

    OS.innerHTML = "Клавиатура создана в операционной системе Windows"
    changeLanguage.innerHTML = "Для переключения языка комбинация: ctrl + alt"

    const descriptionBlock = document.createElement('div')
    descriptionBlock.className = "description"
    descriptionBlock.append(OS, changeLanguage)

    return descriptionBlock
}

function deleteAfter(myField) {
    const myFieldInner = myField
    const startPos = myFieldInner.selectionStart;
    const endPos = myFieldInner.selectionEnd;
    const cursorPos = myFieldInner.value.substring(0, startPos).length

    myFieldInner.value = myFieldInner.value.substring(0, startPos)
        + myFieldInner.value.substring(endPos + 1, myFieldInner.value.length);

    myField.setSelectionRange(cursorPos, cursorPos)
}

function deleteBefore(myField) {
    const myFieldInner = myField
    const startPos = myFieldInner.selectionStart;
    const endPos = myFieldInner.selectionEnd;

    if (startPos === 0)
        return

    const cursorPos = myFieldInner.value.substring(0, startPos - 1).length

    myFieldInner.value = myFieldInner.value.substring(0, startPos - 1)
        + myFieldInner.value.substring(endPos, myFieldInner.value.length);

    myField.setSelectionRange(cursorPos, cursorPos)
}

function resetVisibles() {
    const allKeyButtons = document.querySelectorAll('.keyboard .key > span > span')

    allKeyButtons.forEach(el => el.classList.remove('active'))
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
        const cursorPos = myFieldInner.value.substring(0, startPos).length + myValue.length
        myFieldInner.value = myFieldInner.value.substring(0, startPos)
            + myValue
            + myFieldInner.value.substring(endPos, myFieldInner.value.length);

        myField.setSelectionRange(cursorPos, cursorPos)
    } else {
        myFieldInner.value += myValue;
    }
}

function createTextArea() {
    textarea = document.createElement('textarea')
    textarea.className = 'textarea'
    textarea.rows = 15

    return textarea
}

function createKeyboard() {
    const keyboard = document.createElement('div')
    keyboard.className = 'keyboard'

    return keyboard
}


let language = 'rus'

function fillState() {
    resetVisibles()

    const letters = document.querySelectorAll(`.${language} .${keyboardState}`)
    letters.forEach(el => el.classList.add('active'))
}

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('language')) {
        language = localStorage.getItem('language')
        fillState()
    }
})

window.addEventListener('beforeunload', () => {
    localStorage.setItem('language', language)
})

function createElement(element) {
    const createdElement = document.createElement('button')
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

    createdElement.addEventListener('click', () => {

        let elementText = createdElement.querySelector('span.active').innerHTML

        if (elementText === 'Alt' || elementText === 'Ctrl') {
            return
        }

        if (elementText === 'Backspace') {
            deleteBefore(textarea)
            return
        }

        if (elementText === 'Del') {
            deleteAfter(textarea)
            return
        }

        if (elementText === 'Tab') {
            elementText = '\t'
        }

        if (elementText === 'Enter') {
            elementText = '\n'
        }

        if (elementText === 'CapsLock') {

            if (keyboardState === 'caps') {
                createdElement.classList.remove('capsed')
                keyboardState = 'caseDown'
            } else if (keyboardState === 'shiftUp') {
                createdElement.classList.add('capsed')
                keyboardState = 'shiftCaps'
            }
            else if (keyboardState === 'shiftCaps') {
                createdElement.classList.remove('capsed')
                keyboardState = 'shiftUp'
            } else {
                createdElement.classList.add('capsed')
                keyboardState = 'caps'
            }

            fillState()

            return
        }

        if (elementText === 'Shift') {
            return
        }

        insertAtCursor(textarea, elementText)
    })


    createdElement.addEventListener('mousedown', () => {
        const elementText = createdElement.querySelector('span.active').innerHTML

        if (elementText === 'Shift' && keyboardState !== 'shiftCaps') {

            keyboardState = keyboardState === 'caps' ? 'shiftCaps' : 'shiftUp'
            fillState()
        }
    })

    createdElement.addEventListener('mouseup', () => {
        const elementText = createdElement.querySelector('span.active').innerHTML
        if (elementText === 'Shift') {
            keyboardState = keyboardState === 'shiftCaps' ? 'caps' : 'caseDown'
            fillState()
        }
    })

    return createdElement
}

getKeys().then(keysArr => {
    textarea = createTextArea()

    textarea.addEventListener('keydown', (e) => {
        e.preventDefault()
    })

    const keyboard = createKeyboard()

    keysArr.forEach(keyElement => {
        keyboard.append(createElement(keyElement))
    })

    document.body.append(textarea, keyboard, addDescription())

    fillState()

    window.addEventListener('keydown', (e) => {

        if (!keysArr.some(el => el.name === e.code))
            return

        e.preventDefault()

        const elementName = document.querySelector(`.${e.code}`)
        elementName.classList.add('hovered')
        let insertedValue = elementName.querySelector('.active').innerHTML

        if (e.altKey && e.ctrlKey) {
            language = language === 'rus' ? 'eng' : 'rus'
            fillState()

            return
        }

        if (e.altKey || e.ctrlKey) {
            return
        }

        if (e.key === 'CapsLock') {

            if (e.repeat)
                return

            if (keyboardState === 'caps') {
                elementName.classList.remove('capsed')
                keyboardState = 'caseDown'
            } else if (keyboardState === 'shiftUp') {
                elementName.classList.add('capsed')
                keyboardState = 'shiftCaps'
            }
            else if (keyboardState === 'shiftCaps') {
                elementName.classList.remove('capsed')
                keyboardState = 'shiftUp'
            } else {
                elementName.classList.add('capsed')
                keyboardState = 'caps'
            }

            fillState()

            return
        }

        if (e.key === 'Shift' && keyboardState !== 'shiftCaps') {
            if (e.repeat)
                return

            keyboardState = keyboardState === 'caps' ? 'shiftCaps' : 'shiftUp'
            fillState()

            return
        }

        if (e.key === 'Backspace') {
            deleteBefore(textarea)
            return
        }

        if (e.key === 'Delete') {
            deleteAfter(textarea)
            return
        }

        if (e.key === 'Tab') {
            insertedValue = '\t'
        }

        if (e.key === 'Enter') {
            insertedValue = '\n'
        }

        insertAtCursor(textarea, insertedValue)
    })

    window.addEventListener('keyup', (e) => {
        if (!keysArr.some(el => el.name === e.code))
            return

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
