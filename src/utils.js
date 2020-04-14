module.exports = {
    /**
     * 睡眠一定时间
     * @param {number} ms 需要睡眠的时间
     * @return {promise}
     */
    async sleep (ms) {
        return new Promise((resolve) => {
            let st = setTimeout(_ => {
                clearTimeout(st);
                return resolve();
            }, ms);
        });
    },
    /**
     * 随时睡眠一个随机值
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @return {promise}
     */
    async randomSleep(min, max) {
        let ms = min + Math.floor(Math.random() * (max - min));
        return this.sleep(ms);
    }
};
