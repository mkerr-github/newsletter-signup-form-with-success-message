document.addEventListener("DOMContentLoaded", () => {

    // ---- Grab the important parts of the page ----
    const form = document.getElementById("newsletter-form");
    const emailInput = form.querySelector("#email");
    const submitBtn = form.querySelector(".submit-btn");

    const subscribeArticle = document.querySelector("article.subscribe");
    const successArticle = document.querySelector("article.success");
    const successEmailSpan = successArticle.querySelector(".success__email");
    const dismissBtn = successArticle.querySelector("button");

    // Accessibility: announce success message
    const successMessage = successArticle.querySelector(".success__message");
    successMessage.setAttribute("aria-live", "polite");

    // Enable/disable submit button based on trimmed email validity
    emailInput.addEventListener("input", () => {
        const isValid = emailInput.value.trim() !== "" && emailInput.validity.valid;
        submitBtn.disabled = !isValid;

        // Show or hide the error span
        const errorSpan = form.querySelector(".form__error");
        if (!isValid) {
            errorSpan.style.display = "block";
        } else {
            errorSpan.style.display = "none";
        }
    });

    // Form submit handler
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailValue = emailInput.value.trim();

        // Check validity AFTER trimming
        if (emailValue === "" || !emailInput.validity.valid) {
            emailInput.reportValidity(); // shows error if empty or invalid
            return;
        }

        // Show the success box first
        successEmailSpan.textContent = emailValue;
        successArticle.classList.replace("invisible", "visible");
        successArticle.setAttribute("aria-hidden", "false");

        // Move focus to dismiss button
        dismissBtn.focus();

        // Hide the subscribe box
        subscribeArticle.classList.replace("visible", "invisible");
        subscribeArticle.setAttribute("aria-hidden", "true");

        // ---- Submit to JSONPlaceholder ----
        fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailValue })
        })
            .then(response => response.json())
            .then(data => {
                // Open a new tab with beginner-friendly explanation
                const newWindow = window.open();
                
                newWindow.document.write(`
                <html>
                <head>
                    <title>Newsletter sign-up form submission - Test Result</title>
                    <style>
                        body {
                            background-color: hsl(234, 29%, 20%);
                            font-family: "Roboto", sans-serif;
                            color: white;
                            padding: 1.25rem;
                        }
                        h1, h2 { color: white; }
                        pre {
                            background: rgba(255, 255, 255, 0.1);
                            padding: 0.625rem;
                            border-radius: 0.5rem;
                            overflow-x: auto;
                            max-width: 37.5rem;
                        }
                        code {
                            background: rgba(255, 255, 255, 0.2);
                            padding: 0.125rem 0.25rem;
                            border-radius: 0.25rem;
                        }
                        ul { padding-left: 1.25rem; }
                    </style>
                </head>
                <body>
                    <h1>Form Submission To Test Server</h1>

                    <h2>Explanation:</h2>

                    <h2>1. What you sent</h2>
                    <p>You typed an email in the form:</p>
                    <pre>${emailValue}</pre>

                    <h2>2. Where it was sent</h2>
                    <p>The data was sent to a test server at <code>https://jsonplaceholder.typicode.com/posts</code>.
                    <br>A mock API resource used for testing and prototyping</p>

                    <h2>3. How it was sent</h2>
                    <p>Using an HTTP POST request with JSON content:</p>
                    <pre>${JSON.stringify({ email: emailValue }, null, 2)}</pre>

                    <h2>4. What the server responded</h2>
                    <p>The server returns a simulated response including your data and a new id:</p>
                    <pre>${JSON.stringify(data, null, 2)}</pre>

                    <h2>5. What it means</h2>
                    <ul>
                        <li><strong>id:</strong> the server-generated ID for your submitted data.</li>
                        <li><strong>email:</strong> the data you sent, echoed back.</li>
                        <li>This response is for testing and learning purposes only; no real email is saved.</li>
                    </ul>
                </body>
                </html>
            `);
                newWindow.document.close();
            })
            .catch(error => {
                console.error("Submission failed:", error);
            });
    });

    // Dismiss button handler
    dismissBtn.addEventListener("click", () => {
        successArticle.classList.replace("visible", "invisible");
        successArticle.setAttribute("aria-hidden", "true");

        subscribeArticle.classList.replace("invisible", "visible");
        subscribeArticle.setAttribute("aria-hidden", "false");

        form.reset();
        submitBtn.disabled = true;

        emailInput.focus();
    });

});
