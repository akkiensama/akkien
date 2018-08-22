// var factoryInstance;

// var ballot;
// var ballotInstance;

// var candidates;

window.addEventListener('load', function() {

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/2ee8969fa00742efb10051fc923552e1"));
    }
    
    console.log('I am web3', web3);

    // Now you can start your app & access web3 freely:
    //startApp();
});

// function startApp() {

//     initContract();
//     //getInitData();
    
//     $("#buyForm").submit(function(event){
//         event.preventDefault();

//         var tokenInput = $("#buyTokenInput").val();
//         if(isNaN(tokenInput)){
//             alert('Wrong type input, please enter number');
//         } else {
//             voteInstance.buy.sendTransaction({from: web3.eth.accounts[0], value: tokenInput, gas: '1000000'}, function(){
//                 location.reload(true);
//             });
//         }
//     });

//     $("#voteForm").submit(function(event){
//         event.preventDefault();

//         var idInput = $("#idInput").val();
//         var tokenInput = $("#voteTokenInput").val();
        
//         if(isNaN(idInput) || isNaN(tokenInput)){
//             alert('Wrong type input, please enter number');
//         } else {
//             voteInstance.voteForCandidate.sendTransaction( candidates[idInput], tokenInput, 
//                 {from: web3.eth.accounts[0], gas: '1000000'}, function(){
//                     location.reload(true);
//             });
//         }
//     });
// }

// function initContract(){ 
//     var factoryABI;
//     $.getJSON('../json/BallotFactory.json', function(data) {
//         factoryABI = JSON.parse(data.interface);
//     });
//     var factory  = web3.eth.contract(ballotFactoryABI);
//     factoryInstance = contract.at('0x4F35bea6557781A34481f5265c2E0181E4F7C435');

//     var ballotABI;
//     $.getJSON('../json/Ballot.json', function(data) {
//         ballotABI = JSON.parse(data.interface);
//     });
//     ballot  = web3.eth.contract(ballotABI);

// }

// function getInitData(){
//     ///get user info
//     voteInstance.voterDetails.call(web3.eth.accounts[0], {from:web3.eth.accounts[0]}, function(err, userInfo){
//         $("#userTokens").text('You bought ' + userInfo[0] + ' tokens');

//         /// get candidates infomation
//         voteInstance.allCandidates.call({from:web3.eth.accounts[0]}, function(err,candidateList){           
//             candidates = candidateList;

//             for(let i = 0; i < candidateList.length; i++){          
//                 voteInstance.totalVotesFor.call(candidateList[i], {from:web3.eth.accounts[0]}, function(err,votes){  
//                     $("#candidatesTb").append(
//                         '<tr><td>' + 
//                         i + '</td><td>' + 
//                         candidateList[i] + '</td><td>' + 
//                         votes + '</td><td>' + 
//                         userInfo[1][i] + '</td></tr>'
//                     );              
//                 });
//             }                         
//         });  

//     });    


//     /// get totalTokens
//     voteInstance.totalTokens.call({from:web3.eth.accounts[0]}, function(err,data){        
//         $("#totalTokens").text(data);
//     });
//     /// get balanceTokens
//     voteInstance.balanceTokens.call({from:web3.eth.accounts[0]}, function(err,data){        
//         $("#balanceTokens").text(data);
//     });
//     /// get tokenPrice
//     voteInstance.tokenPrice.call({from:web3.eth.accounts[0]}, function(err,data){       
//         $("#tokenPrice").text(data + ' wei');
//     });
    
// }






