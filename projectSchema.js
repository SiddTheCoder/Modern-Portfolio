
const projects = [
  {
    title: 'WebChat App - Bolum',
    coverImage: 'https://camo.githubusercontent.com/cbd7d9d0a3a048c35ab342134cc8c77b4c8ad306c0c051a7f4cc9e5e1b43ca8a/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f64697a6a74746678332f696d6167652f75706c6f61642f666c5f70726573657276655f7472616e73706172656e63792f76313735303038333937312f53637265656e73686f745f39395f716679676c622e6a70673f5f733d7075626c69632d61707073',
    description: 'A fully functional web chat app supporting millions of user providing them seamless conversation within real time.',
    visitLink: 'https://bolum.netlify.app',
    stackType: 'Full-Stack'
  },
  {
    title: 'Modern Todo App - NOTY',
    coverImage: 'asset/js-number-gusser.png',
    description: 'A modern TODO App purely made in Javscript and its library REACT.js with some extra components partners',
    visitLink: 'https://siddthecoder.github.io/NOTY',
    stackType: 'Frontend'
  },
  {
    title: 'Number Guesser',
    coverImage: 'asset/js-number-gusser.png',
    description: 'An exceptional coder, Siddhant crafts top-notch solutions that deliver outstanding results for clients. He consistently creates services that exceed expectations',
    visitLink: 'https://siddthecoder.github.io/NumberGuesser-js/',
    stackType: 'DOM'
  },
  {
    title: 'SiddyCoddy',
    coverImage: 'asset/siddycoddy.png',
    description: 'An exceptional coder, Siddhant crafts top-notch solutions that deliver outstanding results for clients. He consistently creates services that exceed expectations',
    visitLink: 'https://siddthecoder.github.io/Real-Site/',
    stackType: 'Website'
  },
  {
    title: 'E-Commerce Website',
    coverImage: 'asset/store.png',
    description: 'An exceptional coder, Siddhant crafts top-notch solutions that deliver outstanding results for clients. He consistently creates services that exceed expectations',
    visitLink: 'https://siddthecoder.github.io/E-Commerce-Website-Frontend/',
    stackType: 'E-Commerce'
  },
  {
    title: 'Facebook Clone',
    coverImage: 'asset/facebook.png',
    description: 'An exceptional coder, Siddhant crafts top-notch solutions that deliver outstanding results for clients. He consistently creates services that exceed expectations',
    visitLink: 'https://siddthecoder.github.io/Blog-Facebook-Clone/',
    stackType: 'Clone'
  },
  {
    title: 'Data Cleaner',
    coverImage: 'asset/data-cleaner.png',
    description: 'An exceptional coder, Siddhant crafts top-notch solutions that deliver outstanding results for clients. He consistently creates services that exceed expectations',
    visitLink: 'https://siddthecoder.github.io/Data-Filterer/',
    stackType: 'Data'
  },
  {
    title: 'GitHub User Finder',
    coverImage: 'asset/githubUserFinder.png',
    description: 'An exceptional coder, Siddhant crafts top-notch solutions that deliver outstanding results for clients. He consistently creates services that exceed expectations',
    visitLink: 'https://siddthecoder.github.io/Githb-Profile-Search.APP/',
    stackType: 'Github'
  }
];


const projectContainer = document.getElementById('project-container');

projects.forEach((project) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="card relative w-80 h-[70vh] backdrop-blur-sm bg-slate-600/30 rounded-lg flex flex-col overflow-hidden shadow-2xl shadow-blue-500/20">
      <div class="gloss rounded-full"></div>
      <div class="w-full h-78 bg-purple-400 overflow-hidden">
        <img class="grayscale-1 transition-all ease-in-out duration-500 hover:scale-110 hover:-rotate-6 -translate-y-[1px]"
             src="${project.coverImage}" alt="${project.title}" />
      </div>
      <div class="p-1 font-happyMonkey text-2xl">
        <span class="bg-purple-800 text-sm text-white rounded pb-1 px-2 font-silkscreen">${project.stackType}</span>
        ${project.title}
      </div>
      <p class="p-1 font-exo font-extralight tracking-wider text-sm">
        "${project.description}"
      </p>
      <div class="p-1">
        <a href="${project.visitLink}" target="_blank">
          <span class="bg-purple-800 text-white rounded pb-1 px-2 font-silkscreen hover:px-10 ease-in-out transition-all duration-300">
            Visit
          </span>
        </a>
      </div>
    </div>
  `;

  projectContainer.appendChild(wrapper.firstElementChild);
});
