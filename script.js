const container = document.querySelector('.container')
const generateBtn = document.querySelector('.generate_btn')
const pointsTxt = document.querySelector('.points_txt')
const resultPointsTxt = document.querySelector('.result_points_txt')
const roundsTxt = document.querySelector('.rounds_txt')
const loader = document.querySelector('.loader')
const box = document.querySelector('.box-all')
const restartGameBtn = document.querySelector('.restart_game_btn')

const skinImg = document.querySelector('#skin_img')

const weapons = [
  'classic',
  'shorty',
  'frenzy',
  'ghost',
  'sheriff',
  'stinger',
  'spectre',
  'bucky',
  'judge',
  'bulldog',
  'guardian',
  'phantom',
  'vandal',
  'marshal',
  'operator',
  'ares',
  'odin'
]

const fetchData = async () => {
  const res = await fetch('https://valorant-api.com/v1/weapons/skins')
    .then(res => res.json())

    return res
}

let points = 0, counter = 0
pointsTxt.innerHTML = `Points: ${points}`
roundsTxt.innerHTML = `Rounds: ${counter}/20`

const generateSkin = async () => {
  loader.style.display = 'block'
  skinImg.style.display = 'none'
  // box.style.display = 'none'
  const ans = await fetchData()

  let btns = [...document.querySelectorAll('.btn')]

  if(typeof(btns) != 'undefined' && btns != null && btns.length > 0) {
    btns.forEach(btn => btn.remove())
  }

  btns = []
  for (let i = 0; i < 4; i++) {
    const button = document.createElement('button')
    button.className = 'btn'
    container.appendChild(button)
    btns.push(button)
  }

  generateBtn.style.display = 'none'
  generateBtn.disabled = true
  
  const randNum = Math.floor(Math.random() * (ans.data.length - 1))
  console.log(randNum, ans.data.length)

  const selectedSkin = ans.data[randNum].displayName.includes('Standard') 
    || ans.data[randNum].displayName.includes('Sovereign')
      ? ans.data[randNum + 1]
      : ans.data[randNum]

  const skinBaseData = selectedSkin.displayName.toLowerCase().split(' ')
  console.log(skinBaseData) // separa cada palavra da skins selecionada
  const skinBase = weapons.filter(weapon => skinBaseData.includes(weapon))
  console.log(skinBase) // vandal, phantom, etc...

  if(skinBase.length <= 0) {
    console.log('Skin fora da lista encontrada.')
    generateSkin()
    return
  } // se a skin não for uma arma da lista, return

  if(selectedSkin.displayIcon) {
    skinImg.src = selectedSkin.displayIcon
    setTimeout(() => {
      loader.style.display = 'none'
      skinImg.style.display = 'block'
    }, 500) // se a arma tiver skin, carrega.
  } else {
    console.log('Não foi possível carregar a imagem. Tentando novamente.')
    generateSkin()
    return
  }

  const skinsDataAux = ans.data.filter(skin => skin.displayName.toLowerCase().includes(skinBase)
    && !skin.displayName.includes('Standard')
    && skin.displayName !== selectedSkin.displayName)
  console.log(`Apenas ${skinBase}`, skinsDataAux) // filtra skins do mesmo tipo, só vandal etc..

  // gera posição da resposta
  const randNumBtnAns = Math.floor(Math.random() * (btns.length))

  let hasRepeated = false, arr = []
  btns.forEach(btn => {
    const randNumBtn = Math.floor(Math.random() * (skinsDataAux.length - 1))
    arr.push(randNumBtn)
    const unique = [...new Set(arr)]
    
    arr.length === unique.length
      ? btn.innerHTML = skinsDataAux[randNumBtn].displayName
      : hasRepeated = true
  })

  if(hasRepeated) {
    console.log('Números repetidos. Gerando skin novamente')
    generateSkin()
    return
  } else {
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if(btns.indexOf(btn) === randNumBtnAns) {
          btn.className = 'btn right-answer'
          points += 1
          pointsTxt.innerHTML = `Points: ${points}`
        } else {
          btn.className = 'btn wrong-answer'
          btns[randNumBtnAns].className = 'btn right-answer'
        }
    
        generateBtn.disabled = false
        generateBtn.style.display = 'block'
        btns.forEach(btn => {
          btn.disabled = true
          btn.style.cursor = 'auto'
        })

        counter++
        roundsTxt.innerHTML = `Rounds: ${counter}/20`
        console.log('rodada:', counter)
        handleGameOver()
      })
    })
  }

  btns[randNumBtnAns].innerHTML = selectedSkin.displayName
}

function handleGameOver() {
  if(counter >= 20) {
    console.log(`Fim de Jogo! Pontos: ${points}/20`)
    generateBtn.style.display = 'none'
    box.style.display = 'block'
    resultPointsTxt.innerHTML = `Você fez ${points} pontos em ${counter} rodadas!`
    restartGameBtn.addEventListener('click', () => {
      restartGame()
      setTimeout(() => {
        box.style.display = 'none'
      }, 700)
    })
  }
}

function restartGame() {
  points = 0
  counter = 0
  pointsTxt.innerHTML = `Points: ${points}`
  roundsTxt.innerHTML = `Rounds: ${counter}/20`
  generateSkin()
}

window.onload = generateSkin()