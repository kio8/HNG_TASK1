const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS

// Function to check if a number is prime
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// Function to check if a number is perfect
const isPerfect = (num) => {
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num && num !== 1;
};

// Function to check if a number is an Armstrong number
const isArmstrong = (num) => {
    const digits = num.toString().split('');
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(parseInt(digit), power), 0);
    return sum === num;
};

// Function to get number properties
const getNumberProperties = (num) => {
    let properties = [];
    if (num % 2 === 0) properties.push("even");
    else properties.push("odd");
    
    if (isPrime(num)) properties.push("prime");
    if (isPerfect(num)) properties.push("perfect");
    if (isArmstrong(num)) properties.push("armstrong");
    
    return properties;
};

// Function to get digit sum
const getDigitSum = (num) => {
    return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
};

// Function to generate fun fact
const getFunFact = (num) => {
    if (isArmstrong(num)) {
        const digits = num.toString().split('');
        const power = digits.length;
        const equation = digits.map(d => `${d}^${power}`).join(" + ");
        return `${num} is an Armstrong number because ${equation} = ${num}`;
    }
    return `${num} is a number with properties: ${getNumberProperties(num).join(", ")}.`;
};

// API Route
app.get('/api/classify-number', async (req, res) => {
    const { number } = req.query;
    
    if (!number || isNaN(number)) {
        return res.status(400).json({ number, error: true });
    }
    
    const num = parseInt(number);
    const properties = getNumberProperties(num);
    const digitSum = getDigitSum(num);
    
    const response = {
        number: num,
        is_prime: isPrime(num),
        is_perfect: isPerfect(num),
        properties,
        digit_sum: digitSum,
        fun_fact: getFunFact(num)
    };
    
    res.json(response);
});

// Start Server
; app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
