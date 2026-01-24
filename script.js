
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Background customization
const backgroundPresets = {
  default: { name: 'warm cream', color: '#faf8f5' },
  lavender: { name: 'soft lavender', color: '#e8dff2' },
  sage: { name: 'sage green', color: '#d4e8d8' },
  blush: { name: 'blush pink', color: '#f5e5e8' },
  sky: { name: 'pale sky', color: '#e5f0f7' },
  peach: { name: 'warm peach', color: '#f5e8d4' }
};

function setBackground(bgKey) {
  const bg = backgroundPresets[bgKey];
  if (bg) {
    document.documentElement.style.setProperty('--primary-bg', bg.color);


    
    // Remove all bg classes
    document.body.classList.remove('bg-default', 'bg-lavender', 'bg-sage', 'bg-blush', 'bg-sky', 'bg-peach');
    
    // Add current bg class
    document.body.classList.add('bg-' + bgKey);
    
//  (Initial commit: add Stillwarm website files)
    localStorage.setItem('selectedBackground', bgKey);
    updateBackgroundButtons(bgKey);
  }
}

function updateBackgroundButtons(activeKey) {
  document.querySelectorAll('.bg-option').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.bg === activeKey) {
      btn.classList.add('active');
    }
  });
}

// Load saved background on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedBg = localStorage.getItem('selectedBackground') || 'default';
  setBackground(savedBg);
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
});

// Smooth scroll helper
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Audio Management
const audioElements = {
  espresso: document.getElementById('audio-espresso'),
  cups: document.getElementById('audio-cups'),
  chatter: document.getElementById('audio-chatter'),
  rain: document.getElementById('audio-rain'),
  fire: document.getElementById('audio-fire'),
  brown: document.getElementById('audio-brown'),
  pad: document.getElementById('audio-pad'),
  wind: document.getElementById('audio-wind'),
  ocean: document.getElementById('audio-ocean')
};


// Sample audio URLs (using royalty-free sources)
const audioURLs = {

  espresso: 'https://assets.mixkit.co/active_storage/sfx/2167/2167-preview.mp3',
  cups: 'https://assets.mixkit.co/active_storage/sfx/934/934-preview.mp3',
  chatter: 'https://assets.mixkit.co/active_storage/sfx/2104/2104-preview.mp3',
  rain: 'https://assets.mixkit.co/active_storage/sfx/1165/1165-preview.mp3',
  fire: 'https://assets.mixkit.co/active_storage/sfx/1896/1896-preview.mp3',

  brown: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_6e9c61c1b0.mp3',
  pad: 'https://cdn.pixabay.com/download/audio/2022/10/30/audio_7c7fd1b5f7.mp3',
  wind: 'https://cdn.pixabay.com/download/audio/2021/11/09/audio_1c2e3b3d1e.mp3',
  ocean: 'https://cdn.pixabay.com/download/audio/2022/02/23/audio_47c2f90c99.mp3'
};

// Set audio sources
Object.keys(audioElements).forEach(key => {
  if (audioElements[key] && audioURLs[key]) {
    audioElements[key].src = audioURLs[key];
  }
});

let masterVolume = 0.3;

function setMasterVolume(value) {
  masterVolume = parseFloat(value);
  Object.values(audioElements).forEach(audio => {
    if (audio && !audio.paused) {
      audio.volume = masterVolume;
    }
  });
}

function startAllSounds() {
  Object.keys(audioElements).forEach(key => {
    const audio = audioElements[key];
    if (audio) {
      audio.volume = 0;
      audio.play().catch(() => {
        console.log('Autoplay blocked for ' + key);
      });
    }
  });
  document.getElementById('audio-espresso').play();
}

// Sound slider management
document.querySelectorAll('.sound-slider').forEach(slider => {
  slider.addEventListener('input', (e) => {
    const audioType = e.target.dataset.audio;
    const volume = parseFloat(e.target.value) * masterVolume;
    const display = e.target.nextElementSibling;
    
    if (audioElements[audioType]) {
      audioElements[audioType].volume = volume;
      if (['brown', 'pad', 'wind', 'ocean'].includes(audioType)) {
        audioElements[audioType].volume = volume * 0.7;
      } else {
        audioElements[audioType].volume = volume;
      }
      if (display) {
        display.textContent = Math.round(parseFloat(e.target.value) * 100) + '%';
      }
    }
  });
});

// Memory Management
function saveMemory() {
  const title = document.getElementById('memoryTitle').value.trim();
  const text = document.getElementById('memoryText').value.trim();
  const mood = document.getElementById('memoryMood').value;

  if (!title || !text) {
    alert('please share both a title and your thoughts before saving.');
    return;
  }

  const memory = {
    id: Date.now(),
    title,
    text,
    mood,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };

  let memories = JSON.parse(localStorage.getItem('memories')) || [];
  memories.unshift(memory);
  localStorage.setItem('memories', JSON.stringify(memories));

  // Clear form
  document.getElementById('memoryTitle').value = '';
  document.getElementById('memoryText').value = '';
  document.getElementById('memoryMood').value = '🌧️ longing';

  // Refresh display
  displayMemories();
}

function displayMemories() {
  const memoryList = document.getElementById('memoryList');
  const memories = JSON.parse(localStorage.getItem('memories')) || [];

  if (memories.length === 0) {
    memoryList.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 2rem;">no memories yet. start writing to capture what matters to you.</p>';
    return;
  }

  memoryList.innerHTML = memories
    .map(
      (memory) => `
        <div class="memory-item">
          <h4>${escapeHtml(memory.title)}</h4>
          <span class="memory-mood">${memory.mood}</span>
          <p class="memory-text">${escapeHtml(memory.text).replace(/\n/g, '<br>')}</p>
          <p class="memory-date">saved on ${memory.date}</p>
          <button class="delete-btn" onclick="deleteMemory(${memory.id})">remove</button>
        </div>
      `
    )
    .join('');
}

function deleteMemory(id) {
  if (confirm('are you sure you want to delete this memory?')) {
    let memories = JSON.parse(localStorage.getItem('memories')) || [];
    memories = memories.filter((m) => m.id !== id);
    localStorage.setItem('memories', JSON.stringify(memories));
    displayMemories();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Spotify Integration
function loadSpotify() {
  const link = document.getElementById('spotifyLink').value.trim();

  if (!link) {
    alert('please paste a spotify playlist link.');
    return;
  }

  if (!link.includes('spotify.com')) {
    alert('please use a valid spotify link.');
    return;
  }

  try {
    const embedLink = link
      .replace('open.spotify.com', 'open.spotify.com/embed')
      .split('?')[0];

    const playerDiv = document.getElementById('spotifyPlayer');
    playerDiv.innerHTML = `
      <iframe style="border-radius: 8px" src="${embedLink}" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
    `;

    localStorage.setItem('spotifyPlaylist', embedLink);
  } catch (error) {
    alert('error loading playlist. please check the link and try again.');
  }
}

// Load saved spotify playlist on page load
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('spotifyPlaylist');
  if (saved) {
    document.getElementById('spotifyPlayer').innerHTML = `
      <iframe style="border-radius: 8px" src="${saved}" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
    `;
  }
  displayMemories();
});

// Page interactions
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.getAttribute('href') !== '#') {
      e.preventDefault();
      const target = this.getAttribute('href');
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});


/* ===============================
   Scroll Reveal Logic
================================ */

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(el => revealObserver.observe(el));


