(() => {
    const CODE = [' ', '.', '_', '+', 'x', 'o', '#', 'H', '&', '@']
    const timeout = fn => setTimeout(fn, 100)
    const main = document.getElementById('canvas')
    const show = document.getElementById('show')
    const color = document.getElementById('color')
    const ctx = main.getContext('2d')
    let completed = 0
    const images = '1'.repeat(20).match(/\d/g)
        .map((a, i) => {
            const img = new Image()
            img.onload = function () {
                completed++
                if (images.length === completed) {
                    const {
                        width,
                        height
                    } = img
                    Object.assign(main, {width, height})
                    drawImage()
                }
            }
            img.src = `img/frames/frame_${i < 10 ? '0' + i : i}_delay-0.07s.gif`
            return img
        })
    
    let current = 0
    function drawImage() {
        const {
            width,
            height
        } = main
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(images[current], 0, 0)

        let codes = ''
        const rate = 1
        for (let i = 0; i < width; i += rate) {
            for (let j = 0; j < height; j += rate) {
                const imageData = ctx.getImageData(j, i, 1, 1)
                if (!imageData) {
                    break
                }
                const [r, g, b] = imageData.data
                let index = Math.floor((255 * 3 - (r + g + b)) * 10 / 256 / 3)
                codes += CODE[index]
            }
            codes += '\n'
        }
        show.innerHTML = codes
        current = (current + 1) % images.length
        timeout(drawImage)
    }

    main.addEventListener('mousemove', ({offsetX, offsetY}) => {
        const pixel = ctx.getImageData(offsetX, offsetY, 1, 1)
        const [r, g, b] = pixel.data
        const rgb = `rgb(${r}, ${g}, ${b})`
        color.style.background = rgb
        color.textContent = `[${offsetX}, ${offsetY}]:` + rgb
    })
})()