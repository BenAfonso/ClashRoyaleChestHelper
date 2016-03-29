angular.module('clashRoyale', ['ui.bootstrap'])
  .controller('mainCtrl', function($scope) {

    var tab = ['Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Magic','Silver','Silver','Gold','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Magic','Silver','Silver','Gold','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Magic','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Silver','Silver','Gold','Silver','Silver','Gold','Silver'];
    var chest_cycle = "SSSGSSGSSSSMSSGSSSGSSSSGSGSSSSGSSSSGSSGSSSSGSSGSSSSISSGSSSGSSS"+
    "SGSGSSSSGSSSSGSSGSSSSGSSGSSSSGSSGSSSGSSSSGSGSSSSGSSSSGSSGSSSSGSSGSSSSMSSGSSS"+
    "GSSSSGSGSSSSGSSSSGSSISSSSGSSGSSSSGSSGSSSGSSSSGSGSSSSISSSSGSSGSSSSMSSGSSSSGSS"+
    "GSSSGSSSSGSGSSSSGSSSSGSSGS";

    $scope.giantNumber = 0;
    $scope.magicNumber = 0;

    $scope.pattern = 'SGSSSSGSGS';

    $scope.addChest = function(type){
      $scope.pattern = $scope.pattern+type;
      $scope.refresh();
    }

    $scope.isPattern = function(count){
      return ($scope.pattern.length >= count);
    }
    $scope.removeChest = function(id){
      var left = $scope.pattern.slice(0,id);
      var right = $scope.pattern.slice(id+1,$scope.pattern.length);
      $scope.pattern = left+right;

      $scope.refresh();
    }


    function getPatternSize(pattern){
      return pattern.length;
    }

    function isUnknown(chest){
        return (chest == 'Unknown');
    }

    function getAllIndexes(cycle,startpos,pattern){
      var indexes = [];
      var i = -1;
      while ((i = cycle.indexOf(pattern[0],i+1)) != -1){
        indexes.push(i+startpos);
      }

      return indexes;
    }


    function getNieme(cycle,n,type){
      var count = 0;
      var i = 0;
      while (count != n && i < cycle.length){
        if (cycle[i] == type){
          count++;
        }
        i++;
      }
      return i;
    }

    /**
    * Calculate the possible start pos in cycle depending of the number of Magic and Giant looted
    */
    function getStartPos(cycle,nMagic,nGiant){
       if (Math.abs(nMagic - nGiant) >= 3){
         throw "Incorrect numbers.";
         return 0;
       }
       return Math.max(getNieme(cycle,nMagic,'M'),getNieme(cycle,nGiant,'I'));
    }




    function getEndPos(cycle,nMagic,nGiant){
      if (Math.abs(nMagic - nGiant) >= 3){
        throw "Incorrect numbers.";
        return 0;
      }
      nMagic++;
      nGiant++;
      return Math.min(getNieme(cycle,nMagic,'M'), getNieme(cycle,nGiant,'I'));
    }


    function getReducedCycle(cycle, startPos, endPos){
       var cycleLength = endPos - startPos;
       newCycle = cycle.slice(startPos, cycleLength);
       return newCycle;
    }

    function searchFirstMagic(results, pattern){
        // Pour chaque résultat, cherchez la distance au plus proche magique.
        var min = 240;
        for(var i=0;i < results.length; i++){
            var last = results[i]+pattern.length;
            Magics = [11,131,203];
            Magics.forEach(function(magic){

                if (last > magic){
                    magic = magic + 240;
                }
                d = Math.abs(magic - last) % tab.length
                if (d < min){
                    min = d;
                }
            });

        }


        return min;
    }

    function getAllPossibilities(cycle,indexes,endPos,pattern){
      var length = getPatternSize(pattern);
      var count;
      var result = [];
      for (var j = 0; j < indexes.length; j++){
        count = 0;
        for (var i = indexes[j]; i < indexes[j]+length; i++)
        {
          if (!(isUnknown(pattern[i-indexes[j]])) && pattern[i-indexes[j]] !== cycle[i] ){
            // Différence pattern / cycle
            break;
          }
          count++;
        }
        if (count == pattern.length && indexes[j] < endPos){
          result.push(indexes[j]);
        }
      }
      return result;
    };


    function getResultat(result, pattern, range){
      var res = [];
      for (var j = 0; j<result.length; j++){
        var temp=[];
        for (var i = result[j]; i < result[j]+pattern.length+range; i++)
        {
          if (i < result[j]+pattern.length){
              isPattern = true;
          }
          else{
              isPattern = false;
          }
          temp.push([isPattern,i,cycle[i]]);
        }
        res.push(temp);
      }

      return res;
    }

    $scope.active = 0;
    $scope.nMagic = 0;
    $scope.nGiant = 0;
    $scope.setActive = function(num){
        $scope.active = num;
    }

    $scope.isActive = function(num){
        return $scope.active == num;
    }
    var cycle = chest_cycle;
    $scope.refresh = function(){
      $scope.startPos = getStartPos(cycle,$scope.nMagic,$scope.nGiant);
      $scope.endPos = getEndPos(cycle,$scope.nMagic,$scope.nGiant);
      newCycle = getReducedCycle(cycle,$scope.startPos,$scope.endPos);


      var indexes = getAllIndexes(cycle,$scope.startPos,$scope.pattern);

      $scope.result = getAllPossibilities(cycle,indexes,$scope.endPos,$scope.pattern);

      $scope.res = getResultat($scope.result, $scope.pattern, 10);
      //$scope.distMin = searchFirstMagic($scope.result, $scope.pattern);
    }

    $scope.incrementGiant = function(){
      $scope.nGiant++;
      $scope.refresh();
    }
    $scope.decrementGiant = function(){
      $scope.nGiant--;
      $scope.refresh();
    }
    $scope.incrementMagic = function(){
      $scope.nMagic++;
      $scope.refresh();
    }
    $scope.decrementMagic = function(){
      $scope.nMagic--;
      $scope.refresh();
    }
    $scope.startPos = getStartPos(chest_cycle,$scope.nMagic,$scope.nGiant);
    $scope.endPos = getEndPos(cycle,$scope.nMagic,$scope.nGiant);
    newCycle = getReducedCycle(cycle,$scope.startPos,$scope.endPos);
    var indexes = getAllIndexes(cycle,$scope.startPos,$scope.pattern);
    $scope.result = getAllPossibilities(newCycle,indexes,$scope.endPos,$scope.pattern);
    //$scope.distMin = searchFirstMagic($scope.result, $scope.pattern);
    $scope.res = getResultat($scope.result, $scope.pattern, 10);





  });
