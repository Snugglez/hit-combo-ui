document.addEventListener('DOMContentLoaded', () => {
  const { Renderer } = require('tera-mod-ui');
  let mod = new Renderer,
    hitText = document.getElementById("hitCount"),
    mainBody = document.getElementById("mainBody"),
    aniTime = null,
    colorArray = ['#BAE1FF', '#BAE8F1', '#BAF7D6', '#CBFFC5', '#EDFFBD', '#FFF7BA', '#F9DEC2', '#FFCBBA', '#FFB6B1', '#FFA5A8', '#F9665E']

  mod.on('hitBox', (y) => {
    if (y.text == 'on') { mainBody.style['border'] = '3px solid rgba(0, 0, 0, 0.5)' }
    if (y.text == 'off') { mainBody.style['border'] = '0px solid black' }
  })

  mod.on('hitUpdate', (y) => {
    clearTimeout(aniTime)
    hitText.innerHTML = `${y.text[0]}${y.text[1]}`
    hitText.style['animation'] = '0.1s shake infinite';
    aniTime = setTimeout(() => { hitText.style['animation'] = '0.1s noShake'; }, 110);
      if (y.text[0] > 100) y.text[0] = 100
      hitText.style['color'] = colorArray[Math.floor(y.text[0] / 10)]
    //if (y.text[0] >= 150) hitText.style['color'] = colorArray[colorArray.length * Math.random() | 0];//fun in theory
  })
})
