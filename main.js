const fileInput = document.getElementById('file-input');
const audioPlayer = document.getElementById('audio-player');
const songTitle = document.getElementById('song-title');
const playPauseButton = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const playlistDisplay = document.getElementById('playlist-display');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentSongIndex = 0;
let playlist = [];
let timeoutId; // To keep track of timeout for song delay

// Handle file input
fileInput.addEventListener('change', (e) => {
    playlist = Array.from(e.target.files);
    displayPlaylist();
    adjustPlayerHeight(playlist.length); // Adjust player height based on playlist
    playSong(0); // Automatically play the first song
});

// Display playlist with scroll functionality
function displayPlaylist() {
    if (playlist.length > 0) {
        playlistDisplay.innerHTML = '<ul>' + playlist.map((song, index) => 
            `<li onclick="playSong(${index})">${song.name}</li>`
        ).join('') + '</ul>';
    } else {
        playlistDisplay.innerHTML = '<p>No songs selected</p>';
    }
}

// Play a specific song
function playSong(index) {
    if (playlist.length > 0) {
        clearTimeout(timeoutId); // Clear any existing timeout
        currentSongIndex = index;
        const song = playlist[index];
        const songUrl = URL.createObjectURL(song);
        audioPlayer.src = songUrl;
        audioPlayer.play();
        songTitle.textContent = song.name;
        playPauseButton.textContent = 'Pause';

        // Automatically play the next song in the queue with a 2-second delay
        audioPlayer.onended = () => {
            timeoutId = setTimeout(() => {
                currentSongIndex = (currentSongIndex + 1) % playlist.length;
                playSong(currentSongIndex);
            }, 2000); // 2-second delay
        };
    }
}

// Handle play/pause button
playPauseButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.textContent = 'Pause';
    } else {
        audioPlayer.pause();
        playPauseButton.textContent = 'Play';
    }
});

// Play previous song
prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    playSong(currentSongIndex);
});

// Play next song
nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    playSong(currentSongIndex);
});

// Progress bar update
audioPlayer.addEventListener('timeupdate', () => {
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.value = percentage || 0;
});

progress.addEventListener('input', () => {
    audioPlayer.currentTime = (progress.value / 100) * audioPlayer.duration;
});

// Volume control
volume.addEventListener('input', () => {
    audioPlayer.volume = volume.value / 100;
});

// Adjust player height based on number of songs
function adjustPlayerHeight(songCount) {
    const player = document.querySelector('.music-player');
    
    // Limit height of the playlist section for scrolling
    if (songCount > 3) {
        playlistDisplay.style.maxHeight = '150px';
        playlistDisplay.style.overflowY = 'scroll';
    } else {
        playlistDisplay.style.maxHeight = 'none';
        playlistDisplay.style.overflowY = 'hidden';
    }
}

// Save and Load Playlist functionality
const saveButton = document.getElementById('save-playlist');
const loadButton = document.getElementById('load-playlist');

saveButton.addEventListener('click', () => {
    const playlistData = playlist.map(song => song.name);
    localStorage.setItem('savedPlaylist', JSON.stringify(playlistData));
    alert('Playlist saved!');
});

loadButton.addEventListener('click', () => {
    const savedPlaylistData = JSON.parse(localStorage.getItem('savedPlaylist'));
    if (savedPlaylistData) {
        playlistDisplay.innerHTML = '<ul>' + savedPlaylistData.map((song, index) =>
            `<li>${song}</li>`
        ).join('') + '</ul>';
    } else {
        alert('No saved playlist found.');
    }
});
