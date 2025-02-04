const express = require('express');
const cors = require('cors');
const axios = require('axios'); // ✅ Import Axios

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
    const absNum = Math.abs(num); // Ignore the negative sign
    const digits = absNum.toString().split('').map(Number);
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
    return sum === absNum;
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



const getDigitSum = (num) => {
    return Math.abs(num) // Take absolute value to handle negatives
        .toString()
        .split('')
        .reduce((sum, digit) => sum + parseInt(digit), 0);
};


const getFunFact = async (num) => {
    let fact = `${num} is a number with properties: ${getNumberProperties(num).join(", ")}.`;

    // If Armstrong, generate the mathematical explanation
    if (isArmstrong(num)) {
        const absNum = Math.abs(num); // Convert to positive for Armstrong calculation
        const digits = absNum.toString().split('');
        const power = digits.length;
        const equation = digits.map(d => `${d}^${power}`).join(" + ");
        fact = `${num} is an Armstrong number because ${equation} = ${absNum}.`;
    }

    // Fetch additional fun fact from Numbers API (use absolute value to avoid errors)
    try {
        const absNum = Math.abs(num); // Use absolute value for API request
        const response = await axios.get(`http://numbersapi.com/${absNum}/math?json`);
        if (response.data && response.data.text) {
            fact += ` Fun fact: ${response.data.text}`;
        }
    } catch (error) {
        console.error("Error fetching fun fact from Numbers API:", error.message);
    }

    return fact;
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
    const funFact = await getFunFact(num); // Await fun fact generation

    const response = {
        number: num,
        is_prime: isPrime(num),
        is_perfect: isPerfect(num),
        properties,
        digit_sum: digitSum,
        fun_fact: funFact
    };

    res.json(response);
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
