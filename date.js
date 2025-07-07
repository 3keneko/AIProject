let imgCount = 0
const data = [
  {
    child: {img: `FakeProfiles/F_00.jpg`, name: 'Corine', price: '20', distance: '2',
            father: {img: `FakeProfiles/M_00.jpg`},
            mother: {img: `FakeProfiles/F_09.jpg`}}
  },
  {
    child: {img: `FakeProfiles/F_01.jpg`, name: 'Mathilde', price: '23', distance: '5',
            father: {img: `FakeProfiles/M_01.jpg`},
            mother: {img: `FakeProfiles/F_05.jpg`}}
  },
  {
    child: {img: `FakeProfiles/F_02.jpg`, name: 'Sylvie', price: '25', distance: '11',
            father: {img: `FakeProfiles/M_02.jpg`},
            mother: {img: `FakeProfiles/F_06.jpg`}}
  },
  {
    child: {img: `FakeProfiles/F_03.jpg`, name: 'Emma', price: '23', distance: '6',
            father: {img: `FakeProfiles/M_03.jpg`},
            mother: {img: `FakeProfiles/F_07.jpg`}}
  }
]

const frame = document.body.querySelector('.frame')
data.forEach(_data => appendCard(_data))

let current = frame.querySelector('.card:last-child')
let likeText = current.children[0]
let startX = 0, startY = 0, moveX = 0, moveY = 0
initCard(current)

document.querySelector("#is-parent").onclick = () => {
document.querySelector("#is-parent").onclick = () => {
  // Open a new blank window
  let parentWindow = window.open("about:blank", "parentsWindow", "width=800,height=600");

  // Extract the current card's child data
  let bgImage = current.style.backgroundImage;
  let imageUrl = bgImage.slice(5, -2); // Extract image path
  let childData = data.find(d => d.child.img === imageUrl);

  if (!childData) {
    parentWindow.document.write("<p>Could not find parent data.</p>");
    parentWindow.document.close();
    return;
  }

  // Write custom content directly into the new window
  parentWindow.document.write(`
    <html>
      <head>
        <title>Parents of ${childData.child.name}</title>
        <style>
          body {
            font-family: sans-serif;
            text-align: center;
            margin-top: 50px;
          }
          .parents {
            display: flex;
            justify-content: center;
            gap: 20px;
          }
          .parents img {
            max-width: 30%;
            height: auto;
            border-radius: 8px;
          }
          button {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>Here are ${childData.child.name}'s parents!</h1>
        <div class="parents">
          <img src="${childData.child.father.img}" alt="Father">
          <img src="${childData.child.mother.img}" alt="Mother">
        </div>
        <p>They look proud, don’t they?</p>
        <button onclick="window.close()">Go Back</button>
      </body>
    </html>
  `);

  parentWindow.document.close();
};
}

document.querySelector('#like').onclick = () => {
  moveX = 1
  moveY = 0
  complete()
}

document.querySelector('#hate').onclick = () => {
  moveX = -1
  moveY = 0
  complete()
}

// document.querySelector("#is-parent").onclick = () => {
//   window.open('parents.html')
//   parentsPicture(current)
// }

function appendCard(data) {
  const firstCard = frame.children[0]
  const newCard = document.createElement('div')
  newCard.className = 'card'
  newCard.style.backgroundImage = `url(${data.child.img})`
  newCard.innerHTML = `
          <div class="is-like">LIKE</div>
          <div class="bottom">
            <div class="title">
              <span>${data.child.name}</span>
            </div>
            <div class="info">
              ${data.child.distance} miles away
            </div>
          </div>
        `
  if (firstCard) frame.insertBefore(newCard, firstCard)
  else frame.appendChild(newCard)
  imgCount++
}

function initCard(card) {
  card.addEventListener('pointerdown', onPointerDown)
}

function setTransform(x, y, deg, duration) {
  current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`
  likeText.style.opacity = Math.abs((x / innerWidth * 2.1))
  likeText.className = `is-like ${x > 0 ? 'like' : 'nope'}`
  if (duration) current.style.transition = `transform ${duration}ms`
}

function onPointerDown({ clientX, clientY }) {
  startX = clientX
  startY = clientY
  current.addEventListener('pointermove', onPointerMove)
  current.addEventListener('pointerup', onPointerUp)
  current.addEventListener('pointerleave', onPointerUp)
}

function onPointerMove({ clientX, clientY }) {
  moveX = clientX - startX
  moveY = clientY - startY
  setTransform(moveX, moveY, moveX / innerWidth * 50)
}

function onPointerUp() {
  current.removeEventListener('pointermove', onPointerMove)
  current.removeEventListener('pointerup', onPointerUp)
  current.removeEventListener('pointerleave', onPointerUp)
  if (Math.abs(moveX) > frame.clientWidth / 2) {
    current.removeEventListener('pointerdown', onPointerDown)
    complete()
  } else cancel()
}

function complete() {
  const flyX = (Math.abs(moveX) / moveX) * innerWidth * 1.3
  const flyY = (moveY / moveX) * flyX
  setTransform(flyX, flyY, flyX / innerWidth * 50, innerWidth)

  const prev = current
  const next = current.previousElementSibling
  if (next) initCard(next)
  current = next
  likeText = current.children[0]
  appendCard(data[imgCount % 4])
  setTimeout(() => frame.removeChild(prev), innerWidth)
}

function cancel() {
  setTransform(0, 0, 0, 100)
  setTimeout(() => current.style.transition = '', 100)
}

