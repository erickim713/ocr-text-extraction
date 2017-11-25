// imports
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

// goal of this module is to generate images of winrates from season 6's patch 6.1 to current patch
// which is 7.22

// code
class Scraper{
    //constructor does nothing
    constructor(){
        return;
    }

    /**
     * Function to scrape the images from the leagueofgraphs.com
     */
    async scrape(){
        let season = 6; //default season to start with
        let patchVer = 1; // default patchVersion to start with
        let inMotion = true; //boolean value for while loop
        let baseUri = 'https://www.leagueofgraphs.com/img/infographics/patch-'; //base uri
        let count = 0; //counter for stopping the while loop for scraping.
        while(inMotion){
            let uriToBeProcessed = baseUri + season + '-' + patchVer + '.jpg';
            await this.requestPage(uriToBeProcessed, season, patchVer)
            .then(
                //if successful in getting the page
                ()=>{
                    patchVer++;
                },
                //if failed in getting the page
                //the reason to fail is either the patchVersion of that season does not exist
                // or if the season of that season number has not started yet.
                ()=>{
                    console.log('FAILED: ', uriToBeProcessed);
                    season++;
                    patchVer = 1;
                    count++;
                }
            )
            if(count == 2){
                //esacpe route with break
                console.log('FAILED TWICE IN A ROW, ESCAPING THE SCRAPING PROCESS.')
                break;
            }
        }
        
    }

    /**
     * 
     * @param {string} uri: the uri to write to the head of the request
     * @param {int} season: the season number to format the name of the jpeg file that's going to be used
     * @param {int} patchVer: the patchVersion number to format the name of the jpeg file that's going to be used
     */
    requestPage(uri, season, patchVer){
        return new Promise((resolve, reject)=>{
            request.head(uri, (err, res, body)=>{
                console.log('HEAD: '+ uri);
                if(res.headers['content-type']==='image/jpeg'){
                    request(uri).pipe(fs.createWriteStream(`./images/${season}-${patchVer}.jpeg`)).on('close',()=>{
                        resolve(true);
                    })
                }
                else{
                    reject(false);
                }
            })
        });
    }
}






module.exports = Scraper;