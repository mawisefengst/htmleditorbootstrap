var app = angular.module('shopifyapp', []);

app.controller('MainCtrl', function($scope) {
  $scope.items = [
	  {id: 1,name: "BMW",country: "Germany"}, 
	  {id: 2,name: "Honda",country: "Japan"}, 
	  {id: 3,name: "Samsung", country: "Korea"}
  ];

  $scope.columns = [
	  {id: "column2",title: "Manufacturer",directive: "secondcolumn",visible: true}, 
	  {id: "column1",title: "ID",directive: "firstcolumn",visible: true}, 
	  {id: "column3",title: "Country", directive: "thirdcolumn",visible: false}
  ];

  $scope.orders = products.orders;

  $scope.fields = [
  	  {name:"id",visible: true},
  	  {name:"order_number",visible: false},
  	  {name:"name",visible: true},
      {name:"total_line_items_price",visible: true},
  	  {name:"updated_at",visible: true},
  	  {name:"created_at",visible: true},
  	  {name:"line_items",visible: true}
  ]
  
  $scope.shuffleColumnOrder = function() {
    $scope.columns = $scope.columns.sort(function() {
      return .5 - Math.random();
    });
  }

});

app.directive('field',function(){
  return {
  	replace: true,
  	transclude: true,
    restrict: 'A',
    scope: { 
    	field : "=",
    	value : "=",
      lineitemflag : "="
    },
    templateUrl:"templates/description.html",
    link: function($scope,$element,$attr){
		 $scope.$watch(
	      	function() {return $scope.$parent.fields;}, 
	      	function(newvalue, oldvalue) {
		        if (newvalue !== oldvalue) {
		          /*$element.children().remove();
		          render($element, $scope);
		          $compile($element.contents())($scope);*/
		          //console.log(oldvalue);
		          //console.log($element);  
              var field = $scope.field;
              newvalue.forEach(function(valIns){
                 if(valIns.name == field ){
                    if(!valIns.visible) jQuery($element).hide();
                    if(valIns.visible) jQuery($element).show();
                 }
              });
		        }
	      }, true);
	}
  };
});


app.directive('item', function($compile) {
  function createTDElement(directive) {
    var table = angular.element('<table><tr><td ' + directive + '></td></tr></table>');
    return table.find('td');
  }

  function render(element, scope) {
    var column, html, i;
    for (i = 0; i < scope.columns.length; i++) {
      column = scope.columns[i];
      if (column.visible) {
        html = $compile(createTDElement(column.directive))(scope);
        element.append(html);
      }
    }
  }

  return {
    restrict: 'A',
    scope: {
      item: "=",
      columns: "="
    },
    controller: function($scope, $element) {
      $scope.$watch(
      	function() {return $scope.columns;}, 
      	function(newvalue, oldvalue) {
	        if (newvalue !== oldvalue) {
	          $element.children().remove();
	          render($element, $scope);
	          $compile($element.contents())($scope);
	        }
      	}, true);
    },
    compile: function() {
      return function(scope, element) {
        render(element, scope);
      }
    }
  };

});

app.directive("firstcolumn", function() {
  return {
    restrict: 'A',
    template: '{{item.id}}'
  }
});

app.directive("secondcolumn", function() {
  return {
    restrict: 'A',
    template: '{{item.name}}'
  }
});

app.directive("thirdcolumn", function() {
  return {
    restrict: 'A',
    template: '{{item.country}}'
  }
});