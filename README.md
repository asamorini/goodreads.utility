# GoodreadsUtility
Utility for https://www.goodreads.com/

Add some utility to Goodreads site:
- when you are on a BOOK page, you can search for only Italian editions


INSTRUCTION: add a Bookmarklet "Goodreads Utility" with this javascript code in the URL
javascript:(function(){var s=document.createElement('SCRIPT');s.type='text/javascript';s.src='https://asamorini.github.io/goodreads.utility/goodreads.utility.v1.0.min.js';document.getElementsByTagName('head')[0].appendChild(s);})();
