import { getData } from './getData';
import { Spaces, Form } from './Interfaces';

// Language checker
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userLang: 'fr' | 'en' =
  (urlParams.get('lang') || navigator.language.slice(0, 2)) == 'fr'
    ? 'fr'
    : 'en';

// Date
const dateNow = Date.now() - (Date.now() % 86400000);
const dataGet: {
  pokemonID: number;
  date: number;
} = JSON.parse(localStorage.getItem('data') as string) || {
  date: 0,
};
const lastDay = dataGet.date;
const difference = dateNow - lastDay >= 86400000;

// HTML Element
const hello = document.querySelector('#hello') as HTMLHeadingElement;
const you = document.querySelector('#you') as HTMLParagraphElement;
const footer = document.querySelector('.footer') as HTMLParagraphElement;
const img = document.querySelector('img') as HTMLImageElement;
const icon = document.querySelector('.icon') as HTMLLinkElement;

const language = (data: Spaces | Form) => {
  const matchName =
    data.names.filter((lang) => lang.language.name == userLang)[0] != undefined
      ? data.names.filter((lang) => lang.language.name == userLang)[0].name
      : data.names[0].name;
  const language = {
    fr: {
      hello: `${
        8 <= new Date().getHours() && new Date().getHours() <= 18
          ? 'Bonjour,'
          : 'Bonsoir,'
      }`,
      you: `Vous êtes un.e ${matchName} aujourd'hui.`,
      footer: `Créée avec <i class="fas fa-heart"></i> par <a href="https://diamant.dev" target="_blank" rel="noopener noreferrer">Diamant</a>. - <a id="tweet" href="https://twitter.com/intent/tweet?text=Today, Je suis un.e ${matchName}, et vous? Regardez ici:&hashtags=WhatPokemonAreYouToday,Pokemon&url=https://wpart.diams.app" target="_blank">Partager sur twitter.</a>`,
    },
    en: {
      hello: `Hello,`,
      you: `You are an ${matchName} today.`,
      footer: `Made with <i class="fas fa-heart"></i> by <a href="https://diamant.dev" target="_blank" rel="noopener noreferrer">Diamant</a>. - <a id="tweet" href="https://twitter.com/intent/tweet?text=Today, I'm an ${matchName}, and you? Check here:&hashtags=WhatPokemonAreYouToday,Pokemon&url=https://wpart.diams.app" target="_blank">Share on twitter.</a>`,
    },
  };
  return language[userLang];
};

getData(difference, dataGet.pokemonID).then((data) => {
  console.log(data);

  const send = {
    pokemonID: data.ID,
    date: difference ? dateNow : lastDay,
  };
  localStorage.setItem('data', JSON.stringify(send));
  const languageText = language(data.PokeData);

  // img.alt = data.ID.toString();
  // img.src =
  //   (data.PokeData.sprites.other?.officialArtwork.frontDefault as string) ||
  //   (data.PokeData.sprites['front_default'] as string);
  // icon.href = data.PokeData.sprites['front_default'] as string;

  hello.innerHTML = languageText.hello;
  you.innerHTML = languageText.you;
  footer.innerHTML = languageText.footer;

  document.body.classList.add('ready');
});
