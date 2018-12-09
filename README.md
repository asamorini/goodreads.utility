# :books: Goodreads Utility
Add some utilities to Goodreads site https://www.goodreads.com/

# INSTRUCTION
1) Add a :bookmark: Bookmark "Goodreads Utility"
   - with this javascript code in the URL
```
javascript:(function(){var s=document.createElement('SCRIPT');s.type='text/javascript';s.src='https://asamorini.github.io/goodreads.utility/dist/goodreads.utility.min.js';document.getElementsByTagName('head')[0].appendChild(s);})();
```
2) and now, when you are visiting www.goodreads.com/ site
   - if you click the bookmark "Goodreads utility" a new menu will be shown
      ![new menu](docs/images/menu.01.added.png)
   - click on it to see utilities
      ![new menu opened](docs/images/menu.02.opened.png)


# LIST OF UTILITIES
### :date: 2018.12.09
* **Search for only Italian editions**
   * visible on BOOK page
         ![Search for Italian editions](docs/images/menu.bookPage.01.searchItalianEditions.png)
   * video showing [Search for only Italian editions](https://asamorini.github.io/goodreads.utility/docs/video/SearchItalianEditions.swf)



### :soon: TODO
* book page-search italian editions
   * default sort by year\publisher
   * possibility to change sorting algorithm
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
   * beautify *readme* https://help.github.com/articles/basic-writing-and-formatting-syntax/
   * load source code versions on *src/js*
* code improvements, next steps
   * check possibility to create a link that automatically add bookmark
   * remove *SAMO* reference
   * externalize citations in separate file
   * search for only Italian editions -> possibility to choose language (browser language as default?)
