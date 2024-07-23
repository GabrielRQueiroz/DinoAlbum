const main = document.getElementById('main')
const addModal = document.getElementById('add-form')
const addModalOpenBtn = document.getElementById('add-btn')
const addModalCloseBtn = document.getElementById('close-btn')
const submitBtn = document.getElementById('submit-btn')
const dinoForm = document.getElementById('dino-form')
const dinoZoom = document.getElementById('dino-zoom')
const dinoZoomContent = document.getElementById('dino-zoom-content')
const dinoZoomTitle = document.getElementById('dino-zoom-title')
const dinoZoomCloseBtn = document.getElementById('zoom-close-btn')
const cardSkeleton = '<div class="card"><header class="card-header"><p class="card-name">{NOME}</p><p class="card-rarity">{RARIDADE}</p></header><p class="card-dino">{DINO}</p></div>'
const cardData = {
    name: '{NOME}',
    rarity: '{RARIDADE}',
    dino: '{DINO}'
}
const rarityText = {
	'common': 'Comum',
	'rare': 'Raro',
	'ultrarare': 'Lendário'
}

const initialize = () => {
    if (localStorage.length > 0) {
		for (let [dinometa, art] of  Object.entries(localStorage)) {
			const [dino, rarity] = dinometa.split(';')

			const card = document.createElement('div')
            card.classList.add('card')
            card.classList.add('border-gradient')
			const cardHeader = document.createElement('header')
            cardHeader.classList.add('card-header')
            const cardName = document.createElement('p')
            cardName.classList.add('card-name')
            const cardRarity = document.createElement('p')
            cardRarity.classList.add('card-rarity')
            cardRarity.classList.add(rarity)
			const cardDinoContainer = document.createElement('button')
			cardDinoContainer.classList.add('card-dino-container')
			const cardDino = document.createElement('pre')
			cardDino.classList.add('card-dino')
			const cardDeleteBtn = document.createElement('button')
            cardDeleteBtn.classList.add('card-delete')

            const dinoName = document.createTextNode(dino)
            const dinoRarity = document.createTextNode(rarityText[rarity])
            const dinoDelete = document.createTextNode('🗑️')
            const dinoArt = document.createTextNode(art)

			cardDeleteBtn.setAttribute('type', 'button')
			cardDeleteBtn.setAttribute('label', `Excluir o dino ${dino}`)
			cardDeleteBtn.addEventListener('click', (e) => {
				localStorage.removeItem(`${dino};${rarity}`)
				window.location.reload()
			})
			cardDinoContainer.setAttribute('type', 'button')
			cardDinoContainer.setAttribute('label', `Ampliar o dino ${dino}`)
			cardDinoContainer.addEventListener('click', (e) => {
				openDinoZoom(dinometa)
			})
            
			card.appendChild(cardHeader)
            card.appendChild(cardDinoContainer)
            card.appendChild(cardDeleteBtn)

            cardHeader.appendChild(cardName)
            cardHeader.appendChild(cardRarity)

			cardDinoContainer.appendChild(cardDino)

            cardName.appendChild(dinoName)
			cardRarity.appendChild(dinoRarity)
            cardDino.appendChild(dinoArt)
			cardDeleteBtn.appendChild(dinoDelete)

			main.appendChild(card)
        }
    }
}

const callAddModal = () => {
	addModal.classList.add('modal-visible')
	addModal.classList.remove('modal-invisible')
	addModalCloseBtn.focus()
}

const closeAddModal = () => {
	addModal.classList.add('modal-invisible')
	addModal.classList.remove('modal-visible')
	addModalOpenBtn.focus()
}

const submitDino = (e) => {
	closeAddModal()

	const data = Object.fromEntries(new FormData(dinoForm).entries())
	const dinoKey = `${data.name};${data.rarity}`
	const dinoValue = data.dino
	
	dinoForm.reset()

	localStorage.setItem(dinoKey, dinoValue)
}

const exportDinos = async () => {
    let dinosCollection = '			====== DINOALBUM ======			\n\n'

	if (localStorage.length > 0) {
		for (let [dinometa, art] of  Object.entries(localStorage)) {
			const [dino, rarity] = dinometa.split(';')
				
			dinosCollection += `> DINO:   ${dino}\n`
			dinosCollection += `> CLASSE: ${rarityText[rarity]}\n`
			dinosCollection += `\n${art}\n===================================================================================================\n\n`
		}

		await navigator.clipboard.writeText(dinosCollection).then(() => alert("Dinos copiados para a área de transferência"))
	} else {
		alert("Não há dinos para copiar ainda.\n\n Adicione um dino para poder gerar um álbum 🦕")
	}
}

closeDinoZoom = () => {
	dinoZoom.classList.add('modal-invisible')
	dinoZoom.classList.remove('modal-visible')

	dinoZoomTitle.innerText = ''
	dinoZoomContent.innerText = ''
}

openDinoZoom = (key) => {
	const [dino, _] = key.split(';')
	const dinoArt = localStorage.getItem(key)

	dinoZoomTitle.innerText = dino
	dinoZoomContent.innerText = dinoArt

	dinoZoom.classList.add('modal-visible')
	dinoZoom.classList.remove('modal-invisible')

	dinoZoomCloseBtn.focus()
}

dinoForm.addEventListener("submit", (e) => submitDino(e))
window.onload = () => initialize()
