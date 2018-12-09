# :books: Goodreads Utility
Add some utilities to Goodreads site https://www.goodreads.com/

# INSTRUCTION
Add a :bookmark: Bookmark "Goodreads Utility" with this javascript code in the URL
```
javascript:(function(){var s=document.createElement('SCRIPT');s.type='text/javascript';s.src='https://asamorini.github.io/goodreads.utility/dist/goodreads.utility.min.js';document.getElementsByTagName('head')[0].appendChild(s);})();
```


# LIST OF UTILITIES
### :date: 2018.12.09
* **Search for only Italian editions** :it:
** visible on BOOK page
** video showing "Search for only Italian editions" https://drive.google.com/open?id=1r7PcI4_UG82jNYpdQzLWs61_Y3gUx0Ag


### :soon: TODO
* possibility to replace on those books lists, for every book, with the corresponding italian edition
   * Recommendations
   * Choice Awards
   * Giveaways
   * New Releases
   * Lists
   * other user bookshelves
* filter reviews to show only italian ones



# :construction: DEVELOPERS TODO
* GITHUB better organization
** beautify *readme* https://help.github.com/articles/basic-writing-and-formatting-syntax/
** load images of functionality on docs/ (and add to *readme*)
** load source code versions on *src/js*
* code improvements, next steps
** remove *SAMO* reference
** externalize citations in separate file
** search for only Italian editions -> possibility to choose language (browser language as default?)
