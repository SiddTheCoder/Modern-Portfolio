document.getElementById('showUpcomingMessage').addEventListener('click', function() {
    const card = document.getElementById('upcomingMessageInfo');
    
    // Show the card with fade-in
    card.classList.add('flex')
    card.classList.remove('hidden');
    setTimeout(() => {
        card.classList.add('opacity-100');
        card.classList.remove('opacity-0');
    }, 100); // Small delay for smooth transition
    
    // Hide the card after 2 seconds with fade-out
    setTimeout(function() {
        card.classList.add('opacity-0');
        card.classList.remove('opacity-100');
        setTimeout(() => {
            card.classList.add('hidden'); // Add hidden after fade-out
        }, 1000); // Duration of the fade-out transition
    }, 3500);
});



/*  

<div id="showUpcomingMessage" class="later w-24 bg-orange-400 rounded flex justify-center cursor-pointer">See Update</div>
    <div>
        <div id="upcomingMessageInfo" class="hidden opacity-0 fixed right-2 bottom-2 bg-purple-900 h-10 w-80 rounded justify-center items-center gap-2 transition-opacity duration-500 ease-in-out">
            <div class="text-purple-500">
                <img class="w-8" src="asset/siddycoddy-no-bg.png" alt="">
            </div>
            <div class="text-purple-300">Available After Upcoming Update</div>
        </div>
    </div>
    

*/