# 🧪 Fake News Detection System — Testing Examples

Use these examples to test the machine learning model. Copy and paste the text into the web application to see the predictions and explanations.

---

## ✅ TRUE NEWS (Real)

### Example 1: Politics & Government
> **Title:** Senate Passes Bipartisan Infrastructure Bill
> 
> **Text:** WASHINGTON (Reuters) - The United States Senate passed a sweeping $1.2 trillion infrastructure bill on Tuesday. The bipartisan legislation includes funding to rebuild roads and bridges, improve public transit systems, and expand broadband internet access across the country. The bill now heads to the House of Representatives for approval before it can be signed into law by the President. Supporters of the bill argue it will create millions of jobs and boost the economy over the next decade.

### Example 2: Science & Health
> **Title:** WHO Announces Significant Decline in Global Malaria Cases Following Vaccine Rollout
> 
> **Text:** GENEVA (Reuters) - The World Health Organization (WHO) reported on Thursday that the global rollout of the newly approved malaria vaccine has contributed to a noticeable decline in severe cases among children in sub-Saharan Africa. Initial data from health ministries in three pilot countries indicates a 30% reduction in hospitalizations for severe malaria. WHO officials cautioned that while the vaccine is a major breakthrough, continued funding for mosquito nets and antimalarial drugs remains critical.

### Example 3: Economy & Business
> **Title:** Wall Street Closes Higher as Tech Stocks Rally
> 
> **Text:** NEW YORK (Reuters) - U.S. stocks ended higher on Friday, driven by a strong rally in the technology sector following better-than-expected earnings reports from major tech companies. The S&P 500 rose 1.5%, while the Nasdaq Composite gained over 2%. Investors appeared optimistic about easing inflation concerns after the Labor Department released its monthly consumer price index data, which showed prices rising at a slower pace than anticipated.

---

## ❌ FAKE NEWS (Fake)

### Example 4: Political Conspiracy & Outrage
> **Title:** BREAKING: Government Caught Secretly Confiscating Bank Accounts!
> 
> **Text:** URGENT ALERT! Anonymous whistleblowers have just leaked highly classified documents proving that the Federal Reserve is secretly planning to confiscate 50% of all American savings accounts by midnight tonight to pay off the national debt! Mainstream media networks are COMPLETELY ignoring this story because they are owned by the globalist elites orchestrating this massive theft. Wake up, patriots! Share this immediately before the government shuts down the internet and it's too late!

### Example 5: Health Hoax
> **Title:** DOCTORS SILENCED: The Hidden Microchips in the New Vaccine
> 
> **Text:** SHOCKING REPORT: A massive government cover-up has finally been exposed! Brave medical researchers have discovered that the latest vaccines contain microscopic tracking chips developed by billionaire elites to monitor the movements of every citizen. Over 50,000 whistleblowers have tried to come forward, but the deep state is actively silencing them all and deleting their posts. Do NOT comply! They don't want you to know the truth!

### Example 6: Fabricated Quote
> **Title:** LEAKED AUDIO: Famous Politician Admits to Hating America!
> 
> **Text:** "I despise the American people and my ultimate goal is to completely ruin this country from the inside out," said a prominent liberal politician during a secret, closed-door meeting with foreign billionaires in Switzerland yesterday. A brave patriot managed to record the audio on his phone and smuggled it out, proving once and for all what the radical left is really trying to achieve. This is the moment we've all been waiting for—justice is finally coming!

---

## 📊 EXAMPLES DIRECTLY FROM YOUR DATASET

### Dataset True 1
> **Title:** Trump urges Congress to pass short-term spending bill
> 
> **Text:** WASHINGTON (Reuters) - U.S. President Donald Trump called on the Republican Congress to pass a short-term government spending bill later on Thursday to avoid a shutdown when current funding expires at midnight on Friday. Republicans in the House of Representatives have unveiled a stopgap spending bill that would allow the government to stay open at current funding levels. "Pass the C.R. (continuing resolution) TODAY and keep our Government OPEN!" Trump wrote in a post on Twitter.

### Dataset True 2
> **Title:** Senate panel votes to advance tax bill
> 
> **Text:** WASHINGTON (Reuters) - The U.S. Senate Budget Committee voted along party lines on Tuesday to send a Republican tax bill to the full Senate for a vote. The 12-to-11 vote "moves us one step closer to a simpler, fairer, and more transparent tax system," Budget Committee Chairman Mike Enzi said in a statement. The full Senate is expected to begin debating the tax bill and vote on it sometime this week. The Republican-controlled House of Representatives has already passed its version of a package of tax cuts.

### Dataset Fake 1
> **Title:** Sources Confirm Robert Mueller's Office Interviewed Jared Kushner Several Weeks Ago
> 
> **Text:** Jared Kushner, senior White House adviser and son-in-law of President Donald Trump, was interviewed by special counsel Robert Mueller s office at the beginning of November, according to a source familiar with the process. As part of an interview that lasted approximately 90 minutes, Kushner was quizzed mainly on his interactions, meetings, and any general contact he had with former national security adviser Michael Flynn, as well as his son, in regards to Flynn s private business dealings with his firm, Flynn Intel Group. Mr. Kushner has voluntarily cooperated with all relevant inquiries and will continue to do so.

### Dataset Fake 2
> **Title:** Trump's Latest Retweet Is Actually The Best Possible Metaphor For His Presidency (IMAGE)
> 
> **Text:** In the middle of a Twitter tantrum directed toward Mitch McConnell, James Clapper, Democrats and the fake news, Donald Trump retweeted a bit of light hearted boasting in the form of a meme that shows Trump eclipsing President Obama. In the meme, Trump s beaming color-filled picture eclipses a dour black and white photo of Obama. More than a few Twitter users saw racist overtones: After all that s happened, this visual is a stark example of white supremacy, literally blotting blackness out.

---

## 🔍 Testing Tips:

*   **Observe the Confidence Score:** The model should be highly confident (e.g., 90%+) on these clear-cut examples.
*   **Check the Explanations:** Click "Show AI Explanation" to see how the model arrived at its decision.
    *   For *Real News*, look for words like "Reuters", "Senate", "officials", or neutral reporting terms driving the score.
    *   For *Fake News*, look for words in ALL CAPS, emotional triggers ("SHOCKING", "URGENT"), or conspiracy terminology driving the score towards "Fake".
*   **History Sidebar:** Notice how each prediction is saved and appears in the history sidebar. Click any history item to quickly re-test it.
