/*************************************
 **** BUDGET CONTROLLER
 */
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
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
    return {
        addItem: function (type, des, val) {
            var newItem;
            // create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                //create new item
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function () {
            
            // calculate total income and expenses

            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses

            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that we spent

            data.percentage = math.round((data.totals.exp / data.totals.inc) * 100);

        },
        getBudget: function () {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: function () {
         console.log(data);
            
        }
    }
})();




/*************************************
 **** UI CONTROLLER
 */
var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function (obj, type) {
            var html, newhtml, element;

            // create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }


            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            // insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function () {
            var fieds, fielsdArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fielsdArr = Array.prototype.slice.call(fields);
            fielsdArr.forEach(function(current, index, array){
                current.value = "";
            });
            fielsdArr[0].focus();
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();





/*************************************
 **** GLOBAL APP CONTROLLER
 */
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventlisteners = function () {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {

            if (event.keyCode === 13 || event.wich === 13) {
                ctrlAddItem();
            }
        });
    };
var updateBudget = function () {

     //1. calculate to the budget

     budgetCtrl.calculateBudget();

     //2. return the budget

     var budget = budgetCtrl.getBudget();

     //3. display the budget on the UI

     console.log(budget);
     

};

    var ctrlAddItem = function () {
        var input, newItem;

        //1. get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
        
        //2. add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        //4. clear the fields

        UICtrl.clearFields();
       
        //5. calculate and update budget

        updateBudget();
        }
        /* console.log(input);*/

    };
    return {
        init: function () {
            console.log('application has started');
            setupEventlisteners();

        }
    };

})(budgetController, UIController);

controller.init();