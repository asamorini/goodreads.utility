# GoodreadsUtility
Utility for https://www.goodreads.com/

Add some utility to Goodreads site:
- when you are on a BOOK page, you can search for only Italian editions
    video showing "Search for only Italian editions" https://drive.google.com/open?id=1r7PcI4_UG82jNYpdQzLWs61_Y3gUx0Ag


INSTRUCTION: add a Bookmarklet "Goodreads Utility" with this javascript code in the URL

javascript:(function(){var s=document.createElement('SCRIPT');s.type='text/javascript';s.src='https://asamorini.github.io/goodreads.utility/goodreads.utility.v1.0.min.js';document.getElementsByTagName('head')[0].appendChild(s);})();
