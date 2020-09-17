var i = 5
var list = []
while (i > 0) {
    list.push(i)
    i--
}
const res = []
const num = 2
var resCount = 0
/**
 * 14
 * 3 - 10
 * 2 - 3
 * 1 - 1
 */
function combine(list, res, num) {
    if (res.length === num) {
        resCount++
        console.log(resCount)
        return
    } else {
        for (let i = 0; i < list.length; i++) {
            const tem = [...res]
            tem.push(list[i])
            const rest_list = [...list]
            rest_list.splice(i, 1)
            combine(rest_list, tem, num)
        }
    }
}
combine(list, res, num)