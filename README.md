# :books: Goodreads Utility (version 1.1)
Add some utilities to Goodreads site https://www.goodreads.com/

## Table of contents
1. [Installation](#installation)
2. [Utilities list](#utilities)
3. [Soon next features](#utilitiesnext)
4. [Versions history](#versions)
5. [Known limitations and bugs](#bugs)
6. [Developers: todo](#devtodo)



# <a name="installation">Installation</a>
1) Add a :bookmark: Bookmark "Goodreads Utility" to your browser
   - copy and paste this javascript code into the bookmark URL
      - by default this installation language is *Italian*
         > samoGoodreadsUtility={'lang':'ita'}
         
      - you can change language by replacing the 'lang' value **ita** with one of this [languages](https://asamorini.github.io/goodreads.utility/docs/languages.txt)
      
      ```
      javascript:var samoGoodreadsUtility={'lang':'ita'};(function(){var s=document.createElement('SCRIPT');s.type='text/javascript';s.src='https://asamorini.github.io/goodreads.utility/dist/goodreads.utility.min.js';document.getElementsByTagName('head')[0].appendChild(s);})();
      ```
2) and now, when you are visiting www.goodreads.com/ site
   - if you click the bookmark "Goodreads utility" a new menu will be shown
      ![new menu](docs/images/menu.01.added.png)
   - click on it to see utilities
      ![new menu opened](docs/images/menu.02.opened.png)



# <a name="utilities">Utilities List</a>
* **Book page: search for editions of specific language**
   [video](https://asamorini.github.io/goodreads.utility/docs/video/SearchItalianEditions.swf)
   * when you are on a BOOK page, you can find list of specific language editions
         ![Search for Italian editions](docs/images/menu.bookPage.01.searchItalianEditions.png)
   



# <a name="utilitiesnext">:soon: Next features</a>
* book page-search italian editions
   * sort
      * default by year\publisher
      * possibility to change by year
   * filter
      * by type (paperback\ebook\audiobook\...)
   * language
      * possibility to include editions without language defined (checkbox, default included, they must be evidenced in some way)
* book list: possibility to replace, for every book, with the corresponding italian edition
   * on those list
      * Recommendations
      * Choice Awards
      * Giveaways
      * New Releases
      * Lists
      * book page, *Books by AUTHOR*
      * other user bookshelves
* reviews
   * filter to show only italian ones
* bookshelves
   * possibility to categorize



# <a name="versions">:date: Versions history</a>

| Date | Version | Improvement
| :---: | :---: | :---
| 2018.12.09  | 1.0 | Search for book editions on specific language (Italian)
| 2018.12.30  | 1.1 | Language selection


# <a name="bugs">:bug: Known limitations and bugs</a>
* It works only on *desktop version* of the site
* Layout is verified only for window larger than 600px


# <a name="devtodo">:construction: Developers TODO</a>
* GITHUB better organization
   * beautify *readme* https://help.github.com/articles/basic-writing-and-formatting-syntax/
* code improvements, next steps
   * menu icon initialization: css transitions background-color (and auto showing expanded menu)
   * bookmarklet creation: check possibility to automatically add bookmark with a link
   * externalize citations in separate file
   * intenazionalization messages and labels
