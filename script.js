const container = document.querySelector('.container')
const generateBtn = document.querySelector('#generate_btn')
const pointsTxt = document.querySelector('#points_txt')

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
pointsTxt.innerHTML = `Points: ${points}/3`
const generateSkin = async () => {
  const ans = await fetchData()
  generateBtn.style.background = 'white'
  generateBtn.style.display = 'none'

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
    document.querySelector('#skin_img').src =
    selectedSkin.displayIcon // se a arma tiver skin, carrega.
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
          btn.style.background = 'green'
          points += 1
          pointsTxt.innerHTML = `Points: ${points}/3`
        } else {
          btn.style.background = 'red'
          btns[randNumBtnAns].style.background = 'green'
        }
        
        generateBtn.disabled = false
        generateBtn.style.background = 'cyan'
        generateBtn.style.display = 'block'
        btns.forEach(btn => {
          btn.disabled = true
          btn.style.cursor = 'auto'
        })

        counter++
        console.log('rodada:', counter)
        handleGameOver()
      })
    })
  }

  btns[randNumBtnAns].innerHTML = selectedSkin.displayName
}

function handleGameOver() {
  if(counter >= 3) {
    console.log(`Fim de Jogo! Pontos: ${points}/3`)
    pointsTxt.innerHTML = `Fim de jogo <br> Points: ${points}/3`
    generateBtn.style.display = 'none'
  }
}

window.onload = generateSkin()