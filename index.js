const main = document.getElementById('main')

const addModal = document.getElementById('add-form')
const addModalOpenBtn = document.getElementById('add-btn')
const addModalCloseBtn = document.getElementById('close-btn')
const submitBtn = document.getElementById('submit-btn')

const dinoZoom = document.getElementById('dino-zoom')
const dinoZoomContent = document.getElementById('dino-zoom-content')
const dinoZoomTitle = document.getElementById('dino-zoom-title')
const dinoZoomClipBtn = document.getElementById('zoom-clip-btn')

const wavesContainer = document.getElementById('waves-container')

const dinoAddForm = document.getElementById('dino-form')
const dinoAddFormName = document.getElementById('name')
const dinoAddFormRarity0 = document.getElementById('rarity-0')
const dinoAddFormRarity1 = document.getElementById('rarity-1')
const dinoAddFormRarity2 = document.getElementById('rarity-2')
const dinoAddFormDinoart = document.getElementById('dino')

const dinoStorageForm = document.getElementById('dino-storage-form')

const rarityMap = {
   'common': {
      'text': 'Comum',
      'weight': 1
   },
   'rare': {
      'text': 'Raro',
      'weight': 2
   },
   'ultrarare': {
      'text': 'Lendário',
      'weight': 3
   }
}

let GLOBAL_DINO_ADD_FORM_META = ''
let GLOBAL_DINO_ZOOM_META = ''

const initialize = () => {
   if (localStorage.length > 0) {
      dinoStorageForm.classList.add('invisible')
      dinoStorageForm.classList.remove('visible')

      const dinos = Object.entries(localStorage)
      dinos.sort(([metaA, _], [metaB, __]) => {
         let [nameA, rarityA, tsA] = metaA.split(';')
         let [nameB, rarityB, tsB] = metaB.split(';')

         if (rarityA === rarityB) return nameA.localeCompare(nameB);
         return rarityMap[rarityB].weight - rarityMap[rarityA].weight
      })

      main.innerHTML = ''

      for (let [dinometa, art] of dinos) {
         const [dino, rarity, timestamp] = dinometa.split(';')

         const card = document.createElement('div')
         card.classList.add('card')
         const cardHeader = document.createElement('header')
         cardHeader.classList.add('card-header')

         const cardName = document.createElement('h2')
         cardName.classList.add('card-name')

         const cardRarity = document.createElement('span')
         cardRarity.classList.add('card-rarity')
         cardRarity.classList.add(rarity)

         const cardTimestamp = document.createElement('span')
         cardTimestamp.classList.add('card-timestamp')
         cardTimestamp.innerHTML = `<i class="bi bi-calendar3"></i> ${new Date(parseInt(timestamp) || 0).toLocaleDateString('pt-BR')}`

         const cardDinoContainer = document.createElement('button')
         cardDinoContainer.classList.add('card-dino-container')

         const cardDino = document.createElement('pre')
         cardDino.classList.add('card-dino')

         const cardDeleteBtn = document.createElement('button')
         cardDeleteBtn.classList.add('card-delete')
         cardDeleteBtn.innerHTML += '<i class="bi bi-trash"></i>'

         const cardEditBtn = document.createElement('button')
         cardEditBtn.classList.add('btn')
         cardEditBtn.setAttribute('type', 'button')
         cardEditBtn.setAttribute('label', `Editar o dino ${dino}`)
         cardEditBtn.setAttribute('title', `Botão de editar ${dino}`)
         cardEditBtn.innerHTML += '<i class="bi bi-pencil"></i>'
         cardEditBtn.innerHTML += '<p class="btn-text">Alterar</p>'
         cardEditBtn.addEventListener('click', (e) => {
            editDino(dinometa)
         })

         const dinoName = document.createTextNode(dino)
         const dinoRarity = document.createTextNode(rarityMap[rarity].text)
         const dinoArt = document.createTextNode(art)

         cardDeleteBtn.setAttribute('type', 'button')
         cardDeleteBtn.setAttribute('label', `Excluir o dino ${dino}`)
         cardDeleteBtn.setAttribute('title', `Botão de excluir ${dino}`)
         cardDeleteBtn.addEventListener('click', (e) => {
            if (!confirm(`Deseja mesmo apagar ${dino}? 🦖🌠`)) return
            localStorage.removeItem(`${dino};${rarity}${timestamp in window ? '' : `;${timestamp}`}`)
            window.dispatchEvent(new Event('storage'))
         })

         cardDinoContainer.setAttribute('id', dinometa)
         cardDinoContainer.setAttribute('type', 'button')
         cardDinoContainer.setAttribute('label', `Ampliar o dino ${dino}`)
         cardDinoContainer.addEventListener('click', (e) => {
            openDinoZoom(dinometa)
         })

         card.appendChild(cardDinoContainer)
         card.appendChild(cardHeader)
         card.appendChild(cardDeleteBtn)

         const cardHeaderContainer = document.createElement('div')
         cardHeaderContainer.classList.add('card-header-container')

         const cardHeaderInnerDiv = document.createElement('div')

         cardHeaderContainer.appendChild(cardName)
         cardHeaderContainer.appendChild(cardHeaderInnerDiv)

         cardHeaderInnerDiv.appendChild(cardTimestamp)
         cardHeaderInnerDiv.appendChild(cardRarity)

         cardHeader.appendChild(cardHeaderContainer)
         cardHeader.appendChild(cardEditBtn)

         cardDinoContainer.appendChild(cardDino)

         cardName.appendChild(dinoName)
         cardRarity.appendChild(dinoRarity)
         cardDino.appendChild(dinoArt)

         main.appendChild(card)
      }
   } else {
      main.innerHTML = ''

      dinoStorageForm.classList.add('visible')
      dinoStorageForm.classList.remove('invisible')
   }
}


const callAddModal = () => {
   document.body.style.overflowY = 'hidden'
   GLOBAL_DINO_ADD_FORM_META = ''

   wavesContainer.classList.remove('animate-waves-container')

   addModal.classList.add('modal-visible')
   addModal.classList.remove('modal-invisible')

   document.body.addEventListener('keydown', handleCloseAddModal)

   dinoAddFormName.focus()
}

const closeAddModal = () => {
   document.body.style.overflowY = 'auto'
   wavesContainer.classList.remove('animate-waves-container')

   addModal.classList.add('modal-invisible')
   addModal.classList.remove('modal-visible')

   document.body.removeEventListener('keydown', handleCloseAddModal)

   dinoAddForm.reset()

   addModalOpenBtn.focus()
}

const openDinoZoom = (key) => {
   document.body.style.overflowY = 'hidden'
   GLOBAL_DINO_ZOOM_META = key

   const [dino, _, __] = key.split(';')
   const dinoArt = localStorage.getItem(key)

   document.body.addEventListener('keydown', handleCloseZoom)

   dinoZoomTitle.innerText = dino
   dinoZoomContent.innerText = dinoArt

   dinoZoom.classList.add('modal-visible')
   dinoZoom.classList.remove('modal-invisible')

   dinoZoomClipBtn.focus()
}

const closeDinoZoom = () => {
   document.body.style.overflowY = 'auto'
   document.getElementById(GLOBAL_DINO_ZOOM_META).focus()

   dinoZoom.classList.add('modal-invisible')
   dinoZoom.classList.remove('modal-visible')

   document.body.removeEventListener('keydown', handleCloseZoom)

   dinoZoomTitle.innerText = ''
   dinoZoomContent.innerText = ''
}

const copyOpenDino = async () =>
   await navigator.clipboard.writeText(dinoZoomContent.innerText)
      .then(() => alert(`${dinoZoomTitle.innerText} copiado`))

const submitDino = (e) => {
   e.preventDefault()

   wavesContainer.classList.add('animate-waves-container')
   document.activeElement.blur()

   const data = Object.fromEntries(new FormData(dinoAddForm).entries())
   const dinoKey = `${data.name};${data.rarity};${Date.now()}`
   const dinoValue = data.dino

   localStorage.removeItem(GLOBAL_DINO_ADD_FORM_META)
   localStorage.setItem(dinoKey, dinoValue)
   window.dispatchEvent(new Event('storage'))

   document.body.removeEventListener('keydown', handleCloseAddModal)
   wavesContainer.addEventListener('click', () => closeAddModal())

   setTimeout(() => {
      dinoAddForm.reset()
   }, 1500)
}

const editDino = (dinometa) => {
   const [dino, rarity, timestamp] = dinometa.split(';')

   dinoAddFormName.value = dino
   if (rarity === 'common') {
      dinoAddFormRarity0.click()
   } else if (rarity === 'rare') {
      dinoAddFormRarity1.click()
   } else if (rarity === 'ultrarare') {
      dinoAddFormRarity2.click()
   }

   callAddModal()

   GLOBAL_DINO_ADD_FORM_META = timestamp in window ? `${dino};${rarity}` : dinometa

   // in windows verifica a nulidade de timestamp
   dinoAddFormDinoart.value = localStorage.getItem(GLOBAL_DINO_ADD_FORM_META)
}

const exportDinoAlbum = async () => {
   let dinosCollection = '			====== DINOALBUM ======			\n\n'

   if (localStorage.length > 0) {
      for (let [dinometa, art] of Object.entries(localStorage)) {
         const [dino, rarity, timestamp] = dinometa.split(';')

         dinosCollection += `🦖 DINO:   ${dino}\n`
         dinosCollection += `✨ CLASSE: ${rarityMap[rarity].text}\n`
         dinosCollection += `📅 ENCONTRADO DIA ${new Date(parseInt(timestamp) || 0).toLocaleString('pt-BR')}`
         dinosCollection += `\n${art}\n===================================================================================================\n\n`
      }

      await navigator.clipboard.writeText(dinosCollection)
      await navigator.clipboard.writeText(JSON.stringify(localStorage)).then(() => alert("Dinos copiados para a área de transferência"))
   } else {
      alert("Não há dinos para copiar ainda.\n\n Adicione um dino para poder gerar um álbum 🦕")
   }
}

const exportDinoStorage = async () => {
   if (localStorage.length > 0) {
      await navigator.clipboard.writeText(localStorage).then(() => alert("Dinos copiados para a área de transferência"))
   } else {
      alert("Não há dinos para copiar ainda.\n\n Adicione um dino para poder gerar um álbum 🦕")
   }
}

const importDinoStorage = (e) => {
   e.preventDefault()

   const data = Object.fromEntries(new FormData(dinoStorageForm).entries())

   try {
      const objects = JSON.parse(data.storage);
      for (let o in objects) {
         localStorage.setItem(o, objects[o]);
      }
   } catch (e) {
      return alert('⚠️  Insira os dinos copiados no formato adequado 🦖🌠')
   }

   initialize();
   alert('Dinos importados com sucesso!')
   return false;
}

const handleCloseAddModal = (e) => {
   if (e.key == "Escape") {
      closeAddModal()
   }
}

const handleCloseZoom = (e) => {
   if (e.key == "Escape") {
      closeDinoZoom()
   }
}

addModal.addEventListener("click", closeAddModal)
addModal.children.item(0).addEventListener('click', (e) => e.stopPropagation())
dinoZoom.addEventListener("click", closeDinoZoom)
dinoZoom.children.item(0).addEventListener('click', (e) => e.stopPropagation())

dinoAddForm.addEventListener("submit", (e) => submitDino(e))
dinoStorageForm.addEventListener("submit", (e) => importDinoStorage(e))

window.addEventListener('storage', () => initialize())

window.onload = () => initialize()
