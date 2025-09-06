document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const themeToggle = document.getElementById('themeToggle');
            const playPauseBtn = document.getElementById('playPauseBtn');
            const playIcon = document.getElementById('playIcon');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const volumeSlider = document.getElementById('volumeSlider');
            const progressContainer = document.getElementById('progressContainer');
            const progress = document.getElementById('progress');
            const currentTimeEl = document.getElementById('currentTime');
            const durationEl = document.getElementById('duration');
            const searchInput = document.getElementById('searchInput');
            const searchBtn = document.getElementById('searchBtn');
            const playlistEl = document.getElementById('playlist');
            const uploadBtn = document.getElementById('uploadBtn');
            const fileInput = document.getElementById('fileInput');
            const trackTitle = document.getElementById('trackTitle');
            const trackArtist = document.getElementById('trackArtist');
            const albumArt = document.getElementById('albumArt');
            const categoryBtns = document.querySelectorAll('.category-btn');

            // Audio context
            const audio = new Audio();
            let isPlaying = false;
            let currentTrackIndex = 0;
            let filteredTracks = [];

            // Sample music data
            const tracks = [
                {
                    title: 'Brain Implant',
                    artist: 'The Weeknd',
                    duration: '0:48',
                    file: 'image-and-music/brain-implant-cyberpunk-sci-fi-trailer-action-intro-330416.mp3',
                    image: './image-and-music/play-music.png',
                    category: 'pop'
                },
                {
                    title: 'Chill Strings',
                    artist: 'The Weeknd',
                    duration: '0:17',
                    file: 'image-and-music/chill-strings-beat-effect-372973.mp3',
                    image: './image-and-music/play-music.png',
                    category: 'pop'
                },
                {
                    title: 'Dark Mystery',
                    artist: 'Dua Lipa',
                    duration: '0:48',
                    file: 'image-and-music/dark-mystery-trailer-taking-our-time-131566.mp3',
                    image: './image-and-music/play-music.png',
                    category: 'electronic'
                },
                {
                    title: 'Relaxing Guitar',
                    artist: 'MGMT',
                    duration: '0:17',
                    file: 'image-and-music/relaxing-guitar-loop-v5-245859.mp3',
                    image: './image-and-music/play-music.png',
                    category: 'rock'
                },
                {
                    title: 'Vlog Music',
                    artist: 'Guns N\' Roses',
                    duration: '1:01',
                    file: 'image-and-music/vlog-music-beat-trailer-showreel-promo-background-intro-theme-274290.mp3',
                    image: './image-and-music/play-music.png',
                    category: 'jazz'
                }
            ];

            // Initialize player
            filteredTracks = [...tracks];
            renderPlaylist();
            loadTrack(currentTrackIndex);

            // Theme toggle
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
            });

            // Play/Pause
            playPauseBtn.addEventListener('click', () => {
                if (isPlaying) {
                    pauseAudio();
                } else {
                    playAudio();
                }
            });

            // Previous track
            prevBtn.addEventListener('click', () => {
                currentTrackIndex--;
                if (currentTrackIndex < 0) {
                    currentTrackIndex = filteredTracks.length - 1;
                }
                loadTrack(currentTrackIndex);
                playAudio();
            });

            // Next track
            nextBtn.addEventListener('click', () => {
                currentTrackIndex++;
                if (currentTrackIndex > filteredTracks.length - 1) {
                    currentTrackIndex = 0;
                }
                loadTrack(currentTrackIndex);
                playAudio();
            });

            // Volume control
            volumeSlider.addEventListener('input', () => {
                audio.volume = volumeSlider.value;
            });

            // Progress bar
            audio.addEventListener('timeupdate', () => {
                const currentTime = audio.currentTime;
                const duration = audio.duration;
                const progressPercent = (currentTime / duration) * 100;
                progress.style.width = `${progressPercent}%`;
                
                // Update time display
                currentTimeEl.textContent = formatTime(currentTime);
                if (!isNaN(duration)) {
                    durationEl.textContent = formatTime(duration);
                }
            });

            // Click on progress bar to seek
            progressContainer.addEventListener('click', (e) => {
                const width = progressContainer.clientWidth;
                const clickX = e.offsetX;
                const duration = audio.duration;
                audio.currentTime = (clickX / width) * duration;
            });

            // Search functionality
            searchBtn.addEventListener('click', searchTracks);
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    searchTracks();
                }
            });

            // Upload button
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    alert('File selected: ' + e.target.files[0].name + '\nIn a real application, this would upload the file.');
                    // Here you would typically handle the file upload
                }
            });

            // Category filter
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const category = btn.dataset.category;
                    
                    // Update active button
                    categoryBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Filter tracks
                    if (category === 'all') {
                        filteredTracks = [...tracks];
                    } else {
                        filteredTracks = tracks.filter(track => track.category === category);
                    }
                    
                    renderPlaylist();
                    currentTrackIndex = 0;
                    if (filteredTracks.length > 0) {
                        loadTrack(currentTrackIndex);
                    }
                });
            });

            // Play audio function
            function playAudio() {
                isPlaying = true;
                audio.play();
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
                
                // Update active playlist item
                const playlistItems = document.querySelectorAll('.playlist-item');
                playlistItems.forEach((item, index) => {
                    if (index === currentTrackIndex) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }

            // Pause audio function
            function pauseAudio() {
                isPlaying = false;
                audio.pause();
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
            }

            // Load track function
            function loadTrack(index) {
                if (filteredTracks.length === 0) return;
                
                const track = filteredTracks[index];
                audio.src = track.file;
                trackTitle.textContent = track.title;
                trackArtist.textContent = track.artist;
                albumArt.src = track.image;
                
                // Wait for audio to load before playing
                audio.addEventListener('loadedmetadata', () => {
                    durationEl.textContent = formatTime(audio.duration);
                });
            }

            // Format time function
            function formatTime(seconds) {
                const min = Math.floor(seconds / 60);
                const sec = Math.floor(seconds % 60);
                return `${min}:${sec < 10 ? '0' + sec : sec}`;
            }

            // Render playlist function
            function renderPlaylist() {
                playlistEl.innerHTML = '';
                
                filteredTracks.forEach((track, index) => {
                    const playlistItem = document.createElement('div');
                    playlistItem.classList.add('playlist-item');
                    if (index === currentTrackIndex) {
                        playlistItem.classList.add('active');
                    }
                    
                    playlistItem.innerHTML = `
                        <div class="playlist-item-img">
                            <img src="${track.image}" alt="${track.title}">
                        </div>
                        <div class="playlist-item-info">
                            <div class="playlist-item-title">${track.title}</div>
                            <div class="playlist-item-artist">${track.artist}</div>
                        </div>
                        <div class="playlist-item-duration">${track.duration}</div>
                    `;
                    
                    playlistItem.addEventListener('click', () => {
                        currentTrackIndex = index;
                        loadTrack(currentTrackIndex);
                        playAudio();
                    });
                    
                    playlistEl.appendChild(playlistItem);
                });
            }

            // Search tracks function
            function searchTracks() {
                const searchText = searchInput.value.toLowerCase();
                
                if (searchText.trim() === '') {
                    filteredTracks = [...tracks];
                } else {
                    filteredTracks = tracks.filter(track => 
                        track.title.toLowerCase().includes(searchText) || 
                        track.artist.toLowerCase().includes(searchText)
                    );
                }
                
                renderPlaylist();
                currentTrackIndex = 0;
                if (filteredTracks.length > 0) {
                    loadTrack(currentTrackIndex);
                }
            }

            // Auto-play next track when current ends
            audio.addEventListener('ended', () => {
                currentTrackIndex++;
                if (currentTrackIndex > filteredTracks.length - 1) {
                    currentTrackIndex = 0;
                }
                loadTrack(currentTrackIndex);
                playAudio();
            });
        });