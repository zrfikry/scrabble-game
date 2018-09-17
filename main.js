document.body.onload = init

const letterlist = [
  // point 0
  { letter: '*', point: 0, qty: 2 },
  // point 1
  { letter: 'A', point: 1, qty: 19 },
  { letter: 'N', point: 1, qty: 9 },
  { letter: 'E', point: 1, qty: 8 },
  { letter: 'I', point: 1, qty: 8 },
  { letter: 'T', point: 1, qty: 5 },
  { letter: 'U', point: 1, qty: 5 },
  { letter: 'R', point: 1, qty: 4 },
  { letter: 'O', point: 1, qty: 3 },
  { letter: 'S', point: 1, qty: 3 },
  // point 2
  { letter: 'K', point: 2, qty: 3 },
  { letter: 'M', point: 2, qty: 3 },
  // point 3
  { letter: 'D', point: 3, qty: 4 },
  { letter: 'G', point: 3, qty: 3 },
  // point 4
  { letter: 'L', point: 4, qty: 3 },
  { letter: 'E', point: 4, qty: 2 },
  { letter: 'P', point: 4, qty: 2 },
  // point 5
  { letter: 'B', point: 5, qty: 4 },
  { letter: 'Y', point: 5, qty: 2 },
  { letter: 'F', point: 5, qty: 1 },
  { letter: 'W', point: 5, qty: 1 },
  // point 8
  { letter: 'C', point: 8, qty: 3 },
  { letter: 'V', point: 8, qty: 1 },
  // point 10
  { letter: 'J', point: 10, qty: 1 },
  { letter: 'Z', point: 10, qty: 1 },
]

let bag = []

// fill the bag
letterlist.map(( card ) => {
  for (let i = 0; i < card.qty; i++) {
    bag.push({ letter: card.letter, point: card.point })
  }
})

const player1Deck = document.querySelector("#player1")
const player2Deck = document.querySelector("#player2")
const player1Score = document.querySelector("#player1score")
const player2Score = document.querySelector("#player2score")
const player1Words = document.querySelector("#player1words")
const player2Words = document.querySelector("#player2words")
const board = document.querySelector("#board")
const turnBox = document.querySelector("#turn")

let player1Hand = []
let player2Hand = []

let selectedCard = {}
let turn = 'player1'
let turnCount = 0
let placementCount = 0
let stats = {
  player1: {
    score: 0,
    skipped: 0,
    words: []
  },
  player2: {
    score: 0,
    skipped: 0,
    words: []
  }
}

const tiles = 16
let boxes = []

let tempPlacement = []
let coorPosition = []
let arah = ''

function init () {
  player1Hand = randomHandDeck(player1Hand)
  player2Hand = randomHandDeck(player2Hand)

  player1Deck.innerHTML = ""
  player2Deck.innerHTML = ""

  player1Hand.map(( card, index ) => displayCard(card, 'player1', index))
  player2Hand.map(( card, index ) => displayCard(card, 'player2', index))

  for (let v = 0; v < tiles; v++) {
    boxes.push([])
    for (let h = 0; h < tiles; h++) {
      boxes[v].push(null)
    }
  }

  render()
}

function render () {
  board.innerHTML = ""

  if (bag.length === 0 && ( player1Hand.length === 0 || player2Hand.length === 0 )) {
    alert('Game selesai!')
    window.location.reload()
  }

  if (placementCount === 0) {
    player1Deck.innerHTML = ""
    player2Deck.innerHTML = ""
    player1Hand.map(( card, index ) => displayCard(card, 'player1', index))
    player2Hand.map(( card, index ) => displayCard(card, 'player2', index))
  }
  console.log('in bag:', bag.length)
  console.log(stats)

  if (turn === 'player1') {
    player1Deck.style.display = 'block'
    player2Deck.style.display = 'none'
  } else {
    player1Deck.style.display = 'none'
    player2Deck.style.display = 'block'
  }

  turnBox.innerHTML = turn.toUpperCase()

  player1Score.innerText = stats.player1.score
  player2Score.innerText = stats.player2.score

  boxes.map(( boxRow , v) => {
    boxRow.map(( box, h ) => {
      let newBox = document.createElement("button")
      newBox.className = "box"
      if (v === 0) {
        newBox.disabled = true
        newBox.innerText = h === 0 ? '' : h
        newBox.style.border = 'none'
        newBox.style.background = '#eee'
        newBox.style.color = '#000'
      } else if (h === 0) {
        newBox.disabled = true
        newBox.innerText = v
        newBox.style.border = 'none'
        newBox.style.background = '#eee'
        newBox.style.color = '#000'
      } else {
        newBox.id = v + "-" + h
        // cek apakah langkah pertama? untuk memaksa memulai dari tengah
        if (placementCount === 0 && newBox.id !== '8-8') {
          newBox.disabled = true
        }

        if (box !== null) {
          newBox.innerText = box.split('-')[0]
          newBox.disabled = true
          let pointInBox = document.createElement("span")
          pointInBox.className = "point"
          pointInBox.innerText = box.split('-')[1]
          newBox.appendChild(pointInBox)
        }
        newBox.addEventListener("click", boxAssign)
      }
      board.appendChild(newBox)
    })
  })
}

const randomHandDeck = function (cards = []) {
  let tempCard = cards
  let i = tempCard.length
  while ( i < 7 ) {
    let index = Math.floor( Math.random() * bag.length )
    tempCard.push(bag[index])
    bag.splice(index, 1)
    i++
  }
  return tempCard
}

const displayCard = function (card, player, index) {
  let newCard = document.createElement("button")
  newCard.className = "card"
  newCard.innerText = card.letter
  let pointInBox = document.createElement("span")
  pointInBox.innerText = card.point
  newCard.appendChild(pointInBox)
  newCard.value = card.letter + "-" + card.point
  newCard.id = player + "card-" + index
  newCard.addEventListener("click", cardSelect)

  if (player === 'player1') {
    player1Deck.appendChild(newCard)
  } else {
    player2Deck.appendChild(newCard)
  }
}

const cardSelect = function (event) {
  const id = event.target.id.split('-')[1]
  if (event.target.className.includes('selected')) {
    event.target.className = "card"
  } else {
    if (document.querySelector(".card.selected")) {
      document.querySelector(".card.selected").className = "card"
    }
    event.target.className = "card selected"
    selectedCard = {
      id: id,
      value: event.target.value
    }
  }
}

const boxAssign = function (event) {
  if (selectedCard.value !== undefined) {
    let letter = selectedCard.value.split('-')[0]
    let point = selectedCard.value.split('-')[1]
    let process = false
    if (letter === '*') {
      let newLetter = prompt('Insert new letter')
      if (newLetter) {
        letter = newLetter.toUpperCase()
        selectedCard.value = newLetter.toUpperCase() + '-' + point
        process = true
      } else {
        resetAssign()
      }
    } else {
      process = true
    }
    
    if (process) {
      event.target.innerText = letter
      let pointInBox = document.createElement("span")
      pointInBox.className = "point"
      pointInBox.innerText = selectedCard.value.split('-')[1]
      event.target.appendChild(pointInBox)
      
      event.target.disabled = true
      tempPlacement.push({ coor: event.target.id, data: selectedCard })
      if (coorPosition.length === 0) {
        coorPosition[0] = event.target.id
        coorPosition[1] = event.target.id
      } else {
        if (coorPosition[1] === undefined) {
          // jika posisi terakhir kosong
          coorPosition[1] = event.target.id
        } else {
          // jika terisi, cek apakah box yg baru itu sesudah atau sebelum box yg baru
          let hPos1 = Number(coorPosition[1].split('-')[0])
          let hPos2 = Number(event.target.id.split('-')[0])
          let vPos1 = Number(coorPosition[1].split('-')[1])
          let vPos2 = Number(event.target.id.split('-')[1])
          if (hPos1 < hPos2 || vPos1 < vPos2) {
            coorPosition[1] = event.target.id
          } else {
            coorPosition[0] = event.target.id
          }

          // cek arah, horizontal / vertical
          if (hPos1[0] === hPos2[0]) {
            arah = 'horizontal'
          } else {
            arah = 'vertical'
          }
        }
      }
      let pos = event.target.id.split('-')
      boxes[pos[0]][pos[1]] = selectedCard.value
      document.querySelector("#" + turn + "card-" + selectedCard.id).style.display = "none"
      selectedCard = {}

      // disable semua kecuali arah yg ditentukan
      // if (coorPosition[0] !== coorPosition[1]) {
      //   console.log(coorPosition)
      //   if (arah === 'horizontal') {
      //     const blocks = document.querySelectorAll(".box[id^='"+coorPosition[1].split('-')[0]+"-']")
      //     blocks.forEach((item) => {
      //       item.disabled = true
      //     })
      //   } else {
      //     console.log(arah)
      //   }
      // }
    }
    placementCount++
    render()
  }
}

const endTurn = function () {
  let word = checkWord()
  let notWord = 0
  word.map(( item ) => {
    let renderedWord = renderWord(item)
    if (renderedWord !== null) {
      const isWord = confirm("is '" + renderedWord + "' a word?")
      if (!isWord) {
        notWord++
      }
    } else {
      notWord++
    }
  })

  if (notWord === 0) {
    tempPlacement.map(( item ) => {
      let h = item.coor.split('-')[0]
      let v = item.coor.split('-')[1]
      boxes[h][v] = item.data.value

      if(turn === 'player1') {
        player1Hand.splice(item.data.id, 1)
      } else {
        player2Hand.splice(item.data.id, 1)
      }
    })

    setStat(turn, word)
    turnCount++

    if(turn === 'player1') {
      turn = 'player2'
    } else {
      turn = 'player1'
    }

    tempPlacement = []
    coorPosition = []

    player1Deck.innerHTML = ""
    player2Deck.innerHTML = ""
    player1Hand = randomHandDeck(player1Hand)
    player2Hand = randomHandDeck(player2Hand)
    
    player1Hand.map(( card, index ) => displayCard(card, 'player1', index))
    player2Hand.map(( card, index ) => displayCard(card, 'player2', index))
    render()
  } else {
    resetAssign()
  }
}

const checkWord = function () {
  let pos1 = coorPosition[0].split('-') // (h, v) posisi awal
  let pos2 = coorPosition[1].split('-') // (h, v) posisi akhir
  let word = []
  let wordsCreated = []

  // cek arah, horizontal / vertical
  if (pos1[0] === pos2[0]) {
    arah = 'horizontal'
    if (pos1[0] < pos2[0]) {
      let switchPos = pos1
      pos1 = pos2
      pos2 = switchPos
    }
  } else {
    arah = 'vertical'
    if (pos1[1] < pos2[1]) {
      let switchPos = pos1
      pos1 = pos2
      pos2 = switchPos
    }
  }

  // HORIZONTAL
  if (arah === 'horizontal') {
    let i = 1
    while (true) {
      // cek apakah 1 box sebelumnya terdapat huruf
      if (boxes[pos1[0]][Number(pos1[1]) - i]) {
        coorPosition[0] = pos1[0] + "-" + (Number(pos1[1]) - i)
        pos1 = coorPosition[0].split('-')
        i++
      } else {
        break
      }
    }

    i = 1
    while (true) {
      // cek apakah 1 box sesudahnya terdapat huruf
      if (boxes[pos2[0]][Number(pos2[1]) + i]) {
        coorPosition[1] = pos2[0] + "-" + (Number(pos2[1]) + i)
        pos2 = coorPosition[1].split('-')
        i++
      } else {
        break
      }
    }
  } else {
    // VERTICAL
    i = 1
    while (true) {
      // cek apakah 1 box sebelumnya terdapat huruf
      if (boxes[ Number(pos1[0]) - i ] !== undefined && boxes[ Number(pos1[0]) - i ][ pos1[1] ]) {
        coorPosition[0] = (Number(pos1[0]) - i) + "-" + pos1[1]
        pos1 = coorPosition[0].split('-')
        i++
      } else {
        break
      }
    }

    i = 1
    while (true) {
      // cek apakah 1 box sesudahnya terdapat huruf
      if (boxes[ Number(pos2[0]) + i ] !== undefined && boxes[ Number(pos2[0]) + i ][ pos2[1] ]) {
        coorPosition[1] = (Number(pos2[0]) + i) + "-" + pos2[1]
        pos2 = coorPosition[1].split('-')
        i++
      } else {
        break
      }
    }
  }

  
  if (arah === "horizontal") {
    for (let i = Number(pos1[1]); i <= Number(pos2[1]); i++) {
      word.push( boxes[pos1[0]][i] )
    }
    wordsCreated.push(word)
    word = []
    // check kata yg tidak sengaja terbuat dalam vertical
    tempPlacement.map(( item ) => {
      let position = item.coor.split('-')
      let currentWord = [ item.data.value ]
      let preWord = []
      let postWord = []
      let i = 1
      while (true) {
        // cek apakah 1 box sebelumnya terdapat huruf
        if (boxes[ Number(position[0]) - i ] !== undefined && boxes[ Number(position[0]) - i ][ position[1] ]) {
          preWord.push( boxes[ Number(position[0]) - i ][ position[1] ] )
          i++
        } else {
          break
        }
      }

      i = 1
      while (true) {
        // cek apakah 1 box sesudahnya terdapat huruf
        if (boxes[ Number(position[0]) + i ] !== undefined && boxes[ Number(position[0]) + i ][ position[1] ]) {
          postWord.push( boxes[ Number(position[0]) + i ][ position[1] ] )
          i++
        } else {
          break
        }
      }

      word = preWord.reverse().concat(currentWord).concat(postWord)
      if (word.length > 1) {
        wordsCreated.push(word)
        word = []
      }
    })
  } else {
    for (let i = Number(pos1[0]); i <= Number(pos2[0]); i++) {
      word.push( boxes[i][pos1[1]] )
    }
    wordsCreated.push(word)
    word = []

    // check kata yg tidak sengaja terbuat dalam horizontal
    tempPlacement.map(( item ) => {
      let position = item.coor.split('-')
      let currentWord = [ item.data.value ]
      let preWord = []
      let postWord = []
      let i = 1
      while (true) {
        // cek apakah 1 box sebelumnya terdapat huruf
        if (boxes[position[0]][Number(position[1]) - i]) {
          preWord.push( boxes[ position[0] ][ Number(position[1]) - i ] )
          i++
        } else {
          break
        }
      }

      i = 1
      while (true) {
        // cek apakah 1 box sesudahnya terdapat huruf
        if (boxes[position[0]][Number(position[1]) + i]) {
          postWord.push( boxes[ position[0] ][ Number(position[1]) + i ] )
          i++
        } else {
          break
        }
      }

      word = preWord.reverse().concat(currentWord).concat(postWord)
      if (word.length > 1) {
        wordsCreated.push(word)
        word = []
      }
    })
  }
  
  return wordsCreated
}

const resetAssign = function () {
  placementCount -= tempPlacement.length

  tempPlacement.map(( item ) => {
    // munculkan kembali card
    let card = document.querySelector("#" + turn + "card-" + item.data.id)
    let box = document.getElementById(item.coor)
    box.disabled = false
    box.innerText = ""
    card.style.display = 'unset'

    // remove dari boxes
    let coor = item.coor.split('-')
    boxes[coor[0]][coor[1]] = null
  })
  let activeCard = document.querySelector(".card.selected")
  if (activeCard) {
    activeCard.className = "card"
  }

  tempPlacement = []
  coorPosition = []
  render()
}

const setStat = function (player = '', word = []) {
  word.map(( item ) => {
    let score = 0

    item.map(( data ) => {
      score += Number(data.split('-')[1])
    })

    stats[player].score += score
    stats[player].skipped = 0
    stats[player].words.push({
      text: renderWord(item),
      values: item,
    })
  })
}

const renderWord = function (word = []) {
  let joinedWord = ''
  let error = 0
  word.map(( item ) => {
    if (item === null) {
      error++
    } else {
      joinedWord = joinedWord + item.split('-')[0]
    }
  })

  if (error === 0) {
    return joinedWord
  } else {
    alert('Harus menyambung')
    resetAssign()
    return null
  }
}
