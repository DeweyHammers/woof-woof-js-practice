document.addEventListener('DOMContentLoaded', () =>{
  const dogBar = document.querySelector('#dog-bar');
  const dogInfo = document.querySelector('#dog-info');
  const goodDogFilter = document.querySelector('#good-dog-filter');
  let filterStatus = false;

  goodDogFilter.addEventListener('click', () => {
    if(!filterStatus) {
      goodDogFilter.innerText = 'Filter good dogs: ON';
      filterStatus = true;
      fetchDogs();
    } else {
      goodDogFilter.innerText = 'Filter good dogs: OFF'
      filterStatus = false;
      fetchDogs();
    }
  })

  const fetchDogs = () => {
    fetch('http://localhost:3000/pups')
    .then(response => response.json())
    .then(json => renderPups(json));
  }

  const createPup = (pup, goodDog) => {
    const span = document.createElement('span');
    span.innerText = pup.name;
    dogBar.appendChild(span);
    const changeButton = (button) => {
    if(goodDog) {
      button.innerText = 'Good Dog!'
      goodDog = false;
    } else {
      button.innerText = 'Bad Dog!'
      goodDog = true;
      }
    }
    span.addEventListener('click', () => {
      dogInfo.querySelectorAll('*').forEach(n => n.remove());
      const name = document.createElement('h2');
      const image = document.createElement('img');
      const button = document.createElement('button')
      name.innerText = pup.name;
      image.src = pup.image;
      changeButton(button);
      dogInfo.appendChild(image);
      dogInfo.appendChild(name);
      dogInfo.appendChild(button);
      button.addEventListener('click', () => {
      fetch(`http://localhost:3000/pups/${pup.id}`, {
        method: 'PATCH',
        headers: 
        {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({isGoodDog: goodDog})
        }).then(response => response.json)
        .then(changeButton(button))
      });
    });
  }

  const renderPups = (json) => {
    dogBar.querySelectorAll('*').forEach(n => n.remove());
    json.forEach(pup => {
      let goodDog = pup.isGoodDog
      if(filterStatus) {
        if(goodDog) {
          createPup(pup, goodDog);
        }
      } else {
        createPup(pup, goodDog);
      }
    });
  }
  
  fetchDogs();
});