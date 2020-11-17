const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)
const hashMap = xObject || []
let isMenu = []
const buttonCount = 3

const simplifyUrl = (url) => {
    return url
        .replace('http:', '')
        .replace('https:', '')
        .replace('//', '')
        .replace('www.', '')
        .replace(/\/.*/, '')
}

const writeBack = () => {
    const string = JSON.stringify(hashMap)
    localStorage.setItem('x', string)
}

const render = () => {
    $siteList.find('li:not(.last)')
             .remove()
    for (let i = 0; i < hashMap.length; i ++) {
        isMenu[i] = false
    }
    hashMap.forEach((item, index) => {
        const $li = $(`
            <li>
                <a href="${'//' + item.url}">
                    <div class="menu">
                        <div class="select">
                            <div class="modifyDomainNameButton">修改域名</div>
                            <div class="modifyNameButton">修改备注</div>
                            <div class="deleteButton">删除</div>
                        </div>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-more"></use>
                        </svg>
                    </div>
                    <div class="site">
                        <div class="logo">${item.logo.toLocaleUpperCase()}</div>
                        <div class="text">${item.text}</div>
                    </div>
                </a>
            </li>
    `).insertBefore($lastLi)
    })

    Array.from(document.querySelectorAll('.siteList a .icon')).forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault()
            if (e.currentTarget.previousSibling.previousSibling !== null) {
                e.currentTarget.previousSibling.previousSibling.style.display = !isMenu[index] ? "block" : "none"
            }
            isMenu[index] = !isMenu[index]
        })
    })

    Array.from(document.querySelectorAll('.menu [class$=Button]')).forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault()
            const classValue = e.currentTarget.getAttribute("class")
            if (classValue === 'modifyDomainNameButton') {
                const newValue =  window.prompt("input the new Domain Name")
                if (newValue) hashMap[index / buttonCount >> 0].url = simplifyUrl(newValue)
            } else if (classValue === 'modifyNameButton') {
                const newValue = window.prompt("input the new Name")
                if (newValue) hashMap[index / buttonCount >> 0].text = newValue;
            } else if (classValue === 'deleteButton'){
                hashMap.splice(index / buttonCount >> 0, 1)
            }
            writeBack()
            render()
        })
    })
}

window.onbeforeunload = writeBack

$('.addButton').on('click', () => {
    if (hashMap.length >= 8) {
        alert("快捷方式不能超过8个")
        return
    }
    let url = window.prompt('请输入域名')
    let text = window.prompt('请输入名称')
    if (url !== null && text != null) {
        hashMap.push({logo: simplifyUrl(url)[0], url: simplifyUrl(url), text: text})
        writeBack()
        render()
    }
})

document.addEventListener('keypress', e => {
    const {key} = e
    hashMap.forEach((item, index) => {
        if (item.logo.toLocaleLowerCase() ===key) {
            window.open('//' + item.url)
            return
        }
    })
})

render()