function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  const tokenizedExpr = expr.match(/([+*-/)(]{1}|\d+)/g);
  const Operations = {
    PLUS: {
      value: '+',
      priority: 1,
    },
    MINUS: {
      value: '-',
      priority: 1,
    },
    MULTIPLY: {
      value: '*',
      priority: 2,
    },
    DIVIDE: {
      value: '/',
      priority: 2,
    },
  };

  const Parenthesis = {
    LEFT: '(',
    RIGHT: ')',
  };

  const peek = (stack, depth = 1) => stack[stack.length - depth];
  const findOperator = token =>
    Object.values(Operations).find(({ value }) => value === token);

  const isLeft = operator => operator === Parenthesis.LEFT;
  const isRight = operator => operator === Parenthesis.RIGHT;
  const switchOperator = (operator, arg1, arg2) => {
    let result;
    switch (operator) {
      case '+':
        result = +arg1 + +arg2;
        break;
      case '-':
        result = +arg1 - +arg2;
        break;
      case '/':
        result = +arg1 / +arg2;
        break;
      case '*':
        result = +arg1 * +arg2;
        break;
    }
    return result;
  };

  if (
    tokenizedExpr.filter(e => e === Parenthesis.LEFT).length !==
    tokenizedExpr.filter(e => e === Parenthesis.RIGHT).length
  ) {
    throw new Error('ExpressionError: Brackets must be paired');
  }

  const operandStack = [];
  const operatorStack = [];

  for (const token of tokenizedExpr) {
    if (!isNaN(token)) {
      operandStack.push(token);
      continue;
    }

    if ((!operatorStack.length && !isRight(token)) || isLeft(token)) {
      operatorStack.push(token);
      continue;
    }

    const prevOperator = peek(operatorStack);
    const operatorObject = findOperator(token);
    let prevOperatorObject = findOperator(prevOperator);

    if (isRight(token)) {
      while (peek(operatorStack) !== Parenthesis.LEFT) {
        const arg2 = operandStack.pop();
        const operator = operatorStack.pop();
        const arg1 = operandStack.pop();
        let result = switchOperator(operator, arg1, arg2);

        if (result === Infinity) {
          throw new TypeError('TypeError: Division by zero.');
        }

        operandStack.push(result);
      }
      operatorStack.pop();
      continue;
    }

    if (
      isLeft(prevOperator) ||
      isRight(token) ||
      isRight(prevOperator) ||
      operatorObject.priority > prevOperatorObject.priority
    ) {
      operatorStack.push(token);
      continue;
    }

    while (
      prevOperatorObject &&
      operatorObject.priority <= prevOperatorObject.priority
    ) {
      const arg2 = operandStack.pop();
      const operator = operatorStack.pop();
      const arg1 = operandStack.pop();
      let result = switchOperator(operator, arg1, arg2);

      if (result === Infinity) {
        throw new TypeError('TypeError: Division by zero.');
      }
      operandStack.push(result);

      prevOperatorObject = findOperator(peek(operatorStack));

      if (!prevOperatorObject) {
        operatorStack.push(token);
        break;
      }
      if (operatorObject.priority > prevOperatorObject.priority) {
        operatorStack.push(token);
      }
    }
  }
  while (operatorStack.length) {
    const arg2 = operandStack.pop();
    const operator = operatorStack.pop();
    const arg1 = operandStack.pop();
    let result = switchOperator(operator, arg1, arg2);
    if (result === Infinity) {
      throw new TypeError('TypeError: Division by zero.');
    }
    operandStack.push(result);
  }

  return peek(operandStack);
}

module.exports = {
  expressionCalculator,
};
