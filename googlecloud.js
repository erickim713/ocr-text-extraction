// https://vision.googleapis.com/v1/images:annotate?key=YOUR_API-KEY-GOES-HEREEE
// const configInfo = require('./configuration.json');
const fs = require('fs');
const configInfo = JSON.parse(fs.readFileSync('configuration.json', 'utf8'));
const request = require('request');
const Vision = require('@google-cloud/vision');
const testFolder = './images/';


class GoogleCloudAPI{
    constructor(){
        this.reqUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + configInfo['API-KEY'];
        this.vision = new Vision();
    }

    /**
     * uses google vision api to extract texts from the image. pretty cool. however, after parsing i get some errors... [couple errors... in getting write text: so i had to fill in manually..]
     * @param {string} fileName : iamge location in local directory
     */
    extractText(fileName){
        return new Promise((resolve, reject)=>{
            // Performs text detection on the local file
            this.vision.documentTextDetection({ source: { filename: fileName } })
            .then((results) => {
              const fullTextAnnotation = results[0].fullTextAnnotation;
              resolve(fullTextAnnotation.text);
            })
            .catch((err) => {
              console.error('ERROR:', err);
              reject(err);
            });
        })
    }

    /**
     * 
     * @param {array} array: array of strings that are split by '\n' ino rder to pinpoint the
     * location of the information i am looking for. apparently this doesn't ensure that the string is extracted correctly
     * if i do come back to make some improvements. this is where i should work on . so i will put todo
     * here. TODO: not 100%. this part doesn't locate the index of the red side win rate. [i thought all the output would be in 
     * same format, meaning i thought that the red side win percentage would be right before the word Red Side]... 
     */
    findthePercentage(array){
        let percentageResult = [];
        let redSideIndex = array.indexOf('Red Side');
        let blueSideIndex = array.indexOf('Blue Side');
        if(redSideIndex == -1 || blueSideIndex == -1){
            console.log('COULD NOT FIND INDEX OF PERCENTAGE');
            return; //returns undefined
        }
        else{
            percentageResult.push(array[redSideIndex - 1]);
            percentageResult.push(array[blueSideIndex - 1]);
            return percentageResult;
        }
    }

    /**
     * wrap up function for extracting data.
     * first extracts the text using google vision api
     * second splits the string into an array, and tries to find the percentage using the array.
     * last write the result into a percentage.txt and %with it.
     */
    extractData(){
        fs.readdir(testFolder, (err, files) => {
            files.forEach(async file => {
                await this.extractText('./images/'+file) //insert path to the images that i am trying to extract
                .then(
                    //when successful you get a string result
                    (resultingstring)=>{
                        let splitResult = resultingstring.split('\n'); // 'split' the string into an array where it's being split by endofline character
                        let finalPercentage = this.findthePercentage(splitResult);
                        console.log(splitResult);
                        console.log(finalPercentage);
                        if(finalPercentage === undefined){
                            console.log('go back to findthepercentage function')
                        }
                        else{
                            fs.appendFile('percentage.txt', file + "," + finalPercentage + "\n", (err)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log('append success')
                                }
                            })
                        }
                    },
                    //when rejected
                    (err)=>{
                        console.log('EXTRACTING TEXT ERROR: ');
                    }
                )
            });
          })
    }
}

module.exports = GoogleCloudAPI;