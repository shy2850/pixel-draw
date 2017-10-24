class Color {
    static rgb2hsl (_r, _g, _b) {
        var r = _r / 255
        var g = _g / 255
        var b = _b / 255

        var max = Math.max(r, g, b)
        var min = Math.min(r, g, b)
        var h
        var s
        var l = (max + min) / 2

        if (max === min) {
            h = s = 0 // achromatic
        } else {
            var d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
            }
            h /= 6
        }

        return {h, s, l}
    }
    static hsl2rgb (h, s, l) {
        let r, g, b
        function hue2rgb (p, q, t) {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }
        if (s === 0) {
            r = g = b = l // achromatic
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s
            let p = 2 * l - q
            r = hue2rgb(p, q, h + 1 / 3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1 / 3)
        }

        return {r: r * 255 | 0, g: g * 255 | 0, b: b * 255 | 0}
    }
    /**
     * 获取指定级数的渐变颜色数组
     * @memberOf module:zrender/tool/color
     * @param {Array.<string>} colors 颜色组
     * @param {number} [step=20] 渐变级数
     * @return {Array.<string>}  颜色数组
     */
    static getGradientColors (colors, step = 20) {
        let [begin, end] = colors
        let [_r, _g, _b] = [(end.r - begin.r) / step, (end.g - begin.g) / step, (end.b - begin.b) / step]

        if (step === 1) {
            return colors
        } else if (step > 1) {
            return '1'.repeat(step).split('').map((_1, i) => Color.create(
                (begin.r + _r * i) | 0,
                (begin.g + _g * i) | 0,
                (begin.b + _b * i) | 0
            ).toHex())
        }
    }

    lighten (light = 0, saturation = 0, hue = 0) {
        let {h, s, l} = Color.rgb2hsl(this.r, this.g, this.b)
        let {r, g, b} = Color.hsl2rgb(h + hue, s + saturation, l + light)
        return Color.create(r, g, b)
    }

    toHSL () {
        const {r, g, b} = this
        return Color.rgb2hsl(r, g, b)
    }
    toRGB () {
        const {r, g, b} = this
        return `rgb(${r}, ${g}, ${b})`
    }
    toHex () {
        let r = ('0' + this.r.toString(16)).substr(-2)
        let g = ('0' + this.g.toString(16)).substr(-2)
        let b = ('0' + this.b.toString(16)).substr(-2)
        return `#${r}${g}${b}`
    }
    toRGBA (alpha) {
        const {r, g, b} = this
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    static create (r, g, b) {
        let c = new Color()
        if (typeof r === 'string') {
            c = new Color(r)
        } else {
            c.r = r
            c.g = g
            c.b = b
        }
        return c
    }
    static createByHSL (h, s, l) {
        const {r, g, b} = Color.hsl2rgb(h, s, l)
        return Color.create(r, g, b)
    }
    constructor (rgb = '#000000') {
        let [hex, r, g, b] = rgb.length === 4
            ? rgb.match(/#(\w)(\w)(\w)/).map(c => c.repeat(2))
            : rgb.match(/#(\w{2})(\w{2})(\w{2})/)

        this.r = parseInt(r, 16)
        this.g = parseInt(g, 16)
        this.b = parseInt(b, 16)
    }
}