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

const btns = [...document.querySelectorAll('.btn')]
const generateBtn = document.querySelector('#generate_btn')
const answerText = document.querySelector('#ans_text')

const generateSkin = async () => {
  const ans = await fetchData()
  
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
        btns.indexOf(btn) === randNumBtnAns
          ? answerText.innerHTML = 'Acertou parabéns'
          : answerText.innerHTML = 'Como tu errou mano deixa de ser burro'
        })
    })
  }

  btns[randNumBtnAns].innerHTML = selectedSkin.displayName
}