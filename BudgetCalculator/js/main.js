// Budget Controller
var budgetCalculator = (function() {

  var Expense = function(id, desc, val) {
    this.id = id;
    this.desc = desc;
    this.val = val;
    this.percentage = -1;
  };

  var Income = function(id, desc, val) {
    this.id = id;
    this.desc = desc;
    this.val = val;
  };
  // Calculates the percentage
  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.val / totalIncome) * 100);
    } else {
      percentage = -1;
    }

  };

  // Returns it
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };


  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  var calculateTotal = function(type) {
    var sum = 0;

    data.allItems[type].forEach(function(cur) {
      sum += cur.val;
    });
    data.totals[type] = sum;
  };

  return {
    addItem: function(type, desc, val) {

      var newItem, id;

      // [1,2,3,4], next ID = 6
      // [1,2,4,6], next ID = 7
      // id = last id+1

      // auto generating ID according to last item of the array of exp or inc
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      // Create new item based on type
      if (type === 'exp') {
        newItem = new Expense(id, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(id, desc, val);
      }
      // push the item into datastructure
      data.allItems[type].push(newItem);
      // return the new element
      return newItem;
    },

    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // calculate the budget ; inc - exp
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)

      } else {
        data.percentage = -1;
      }
    },
    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    // Get the percentages
    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage()
      });
      return allPerc;
    },

    deleteItem: function(type, id) {
      var ids, index;
      // map returns a new array
      // ids return an array of all the elements
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      // index will locate the index of the id we want
      index = ids.indexOf(id);

      if (index !== -1) {
        // using splice method we remove the element from desiered index "1" tells the program that we want to remove exactly one element
        data.allItems[type].splice(index, 1);
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },
    testing: function() {
      console.log(data);
    }
  }


})();


// UI controller
var UIController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    addButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    budgetIncomeValue: '.budget__income--value',
    budgetExpenseValue: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentage: '.item__percentage',
    dateAndMonth: '.budget__title--month',



  };


  var numberFormat = function(num, type) {

    var numSplit, int, dec, type;
    // remove the sign of number
    num = Math.abs(num);
    // give absolutly 2 decimal numbers to the right
    num = num.toFixed(2);
    // split the numbers to 2 parts decimal part and integer part
    numSplit = num.split('.');
    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3 && int.length <= 6) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    // returning 1 at the begining of number if type = inc and exp if type = exp then concatinate the int and dec variables
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  };
  var nodeListForeach = function(list, callbackFunction) {
    for (var i = 0; i < list.length; i++) {
      callbackFunction(list[i], i);
    }
  };
  return {

    getInput: function() {

      return {
        type: document.querySelector(DOMstrings.inputType).value, // if value = inc then it is + and if value = exp then it is -
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    clearFields: function() {

      var fields, fieldsArray;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

      // convert list to array.
      // since querySelectorAll returns a string, use Array.prototype to call .slice and then bind the this variable to fields using .call
      fieldsArray = Array.prototype.slice.call(fields);

      // use .foreach method that works like the for loop
      // the anonymous function in the .foreach method can receive up to 3 arguments
      fieldsArray.forEach(function(currentValue, index, array) {
        // set the value of the currentValue to empty
        currentValue.value = "";
      });

      // set the focus back to the description element when cleared
      fieldsArray[0].focus();

    },
    displayDate: function() {
      var now, year, month;
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
      monthes = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      document.querySelector(DOMstrings.dateAndMonth).textContent = monthes[month] + ' ' + year;

    },

    displayBudget: function(obj) {

      var type = obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = numberFormat(obj.budget, type);
      document.querySelector(DOMstrings.budgetIncomeValue).textContent = numberFormat(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.budgetExpenseValue).textContent = numberFormat(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }

    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercentage);

      nodeListForeach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = percentages[index] + '---';
        }
      });
    },


    getDomStrings: function() {

      return DOMstrings;
    },

    addListItem: function(obj, type) {
      // create html string with placeholder text
      var html, newHtml, element;

      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete__btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete__btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      // replace the placeholder text with some actula data that we recieve from the object
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.desc);
      newHtml = newHtml.replace('%value%', numberFormat(obj.val, type));
      // insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      var element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },
    changeType: function(){
    var fields = document.querySelectorAll(
      DOMstrings.inputType + ',' +
      DOMstrings.inputDescription + ',' +
      DOMstrings.inputValue);

      nodeListForeach(fields, function(current){
        current.classList.toggle('red-focus');
      });

      document.querySelector(DOMstrings.addButton).classList.toggle('red');
    }
  };
  // Some code
})();

// Global controller
var controller = (function(budgetCtrl, UICtrl) {
  var DOMstrings = UICtrl.getDomStrings();

  var setupEventListners = function() {
    document.querySelector(DOMstrings.addButton).addEventListener('click', addItem);
    document.addEventListener("keyup", function(event) {

      if (event.keyCode === 13) {
        addItem();
      }
    });
    document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOMstrings.inputType).addEventListener('change', UICtrl.changeType);
  };
  var updateBudget = function() {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();
    //2. return the budget
    var budget = budgetCtrl.getBudget();
    //3. Display budget.
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    //1. Calculate the percentages
    budgetCtrl.calculatePercentages();
    //2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    //3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);

  };


  var addItem = function() {

    var input, newItem;
    // get the input data
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // add item to the budgetCalculator
      newItem = budgetCalculator.addItem(input.type, input.description, input.value);
      // add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // clear fields
      UICtrl.clearFields();
      // calculate and update the budget
      updateBudget();
      // calculate and update percentages
      updatePercentages();
    } else {
      alert("Please enter valid input.")
    }

  };

  var ctrlDeleteItem = function() {
    var itemId, splitId, id;

    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemId) {
      // the retrieved id will be inc-1 or exp-1 so we need to split it so we get an array with ["inc", "1"]
      splitId = itemId.split('-');
      // the 0th element is the type
      type = splitId[0];
      // the 1th element is the id
      id = parseInt(splitId[1]);

      // Delete item from datastructure
      budgetCtrl.deleteItem(type, id);
      // Delete item from UI
      UICtrl.deleteListItem(itemId);

      // Update and show new budget
      updateBudget();
    }
  };
  return {
    init: function() {
      UICtrl.displayDate();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListners();
    }
  }
})(budgetCalculator, UIController);

controller.init();
