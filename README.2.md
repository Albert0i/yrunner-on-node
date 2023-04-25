## The sequel to YON --- Caching code tables


<div style="text-align: center; color:white; background-color:black"><em>
Impia tortorum longos hic turba furores<br />
Sanguinis innocui, non satiata, aluit.<br />
Sospite nunc patria, fracto nunc funeris antro,<br />
Mors ubi dira fuit vita salusque patent.<br />
<br />
[Quatrain composed for the gates of a market to be erected upon the site of the Jacobin Club House at Paris.]
</em></div>

### Prologue
In the realm of database, data are treated in different ways. Data, per se, can be divided into [transactional data](https://www.tibco.com/reference-center/what-is-transactional-data) and non-transactional. Code tables, such as employee names, product categories, site/location addresses, are typical non-transactional and be always referenced by transaction data. Since they are infrequently changed, caching code tables <em>somewhere</em> lest round-tripping to backend database again and again for the same set of data, which can be a performance boost especially for tight budget system. 

### I. Caching data


### II. Using cached data


### III. Refreshing stale data


### IV. Summary 


### V. Reference
1. [SQLite](https://www.sqlite.org/index.html)
2. [SQLite Client for Node.js Apps](https://github.com/kriasoft/node-sqlite#readme)
3. [SQLite Extraction of Oracle Tables Tools, Methods and Pitfalls](https://www.linuxjournal.com/content/sqlite-extraction-oracle-tables-tools-methods-and-pitfalls)
4. [The Pit and the Pendulum](https://poemuseum.org/the-pit-and-the-pendulum/)


### Epilogue 
```
這裡邪惡的折磨者長期憤怒，
他被無害的血液滋養，並不滿足。
國今待，葬窟今破，
死亡，生命是可怕的，而健康是開放的。

[為在巴黎雅各賓會所舊址上建造的市場大門而作的四行詩。]
```


### EOF (2023/04/25)
