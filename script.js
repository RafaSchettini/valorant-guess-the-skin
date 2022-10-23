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

const generateSkin = async () => {
  const ans = await fetchData()
  
  const randNum = Math.floor(Math.random() * (ans.data.length - 1))
  console.log(randNum, ans.data.length)

  const skinBaseData = ans.data[randNum].displayName.toLowerCase().split(' ')
  console.log(skinBaseData)
  const skinBase = weapons.filter(weapon => skinBaseData.includes(weapon))
  console.log(skinBase)

  if(skinBase.length <= 0) {
    generateSkin()
    return
  }

  const skinsData = ans.data.filter(skin => skin.displayName.toLowerCase().includes(skinBase)
    && !skin.displayName.includes('Standard'))
  console.log(skinsData)

  const randNumSkin = Math.floor(Math.random() * (skinsData.length - 1))
  console.log(randNumSkin)

  if(skinsData[randNumSkin].displayIcon) {
    document.querySelector('#skin_img').src =
      skinsData[randNumSkin].displayIcon
  } else {
    console.log('Não foi possível carregar a imagem. Tentando novamente.')
    generateSkin()
    return
  }

  const btns = [...document.querySelectorAll('.btn')]

  console.log(btns.length, btns)

  // const btnArr = generateArray(4)
  // for(let i = 0; i < btns.length; i++) {
  //   btns[i].innerHTML = btnArr[i]
  // }

  const randNumAnswer = Math.floor(Math.random() * (btns.length))
  btns[randNumAnswer].innerHTML = skinsData[randNumSkin].displayName

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.indexOf(btn) === randNumAnswer
        ? console.log('Resposta Correta!')
        : console.log('Resposta Incorreta!')
    })
  })
}

// function generateArray(size) {
//   const arr = []

//   while(arr.length !== size) {
//     for(let i = 0; i < size.length; i++) {

//     i = Math.floor(Math.random() * size)

//     if(!arr.includes(i)) {
//       arr.push(i)
//       console.log(arr)
//     }
//   }
//   }
//   return arr
// }

generateSkin()