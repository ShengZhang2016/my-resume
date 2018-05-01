import React, { Component } from 'react';
import './App.css';
import Prism from 'prismjs'
import showdown from 'showdown'

const styleText = [
  `
/*
* Inspired by https://zhuanlan.zhihu.com/p/29134444
* Hey, I'm Sheng Zhang
* Looking for Software Development role...
* Since graduated,
* It's time to create an amazing resume.
* Now, let's begin...
*/

/* Okay, add some transition first */
* {
  transition: all .5s;
}

/* Now, add some background color */
html {
  color: rgb(204, 255, 153); 
  background: rgb(63,82,99);
}

/* Change the margin a little bit */
.styleEditor {
  padding: .5em;
  border: 1px solid;
  margin: .5em;
  overflow: auto;
  background: rgb(48, 48, 48);
}

@media (min-width:500px){
  .styleEditor {
    width: 45vw; 
    height: 90vh;
  }
}

@media screen and (min-width: 320px) and (max-width: 480px) {
  .styleEditor{
    width: 100vw;
    height: 45vh;
  }
}

/* emmm, add something fancy here */
.token.selector{ color: rgb(133,153,0); }
.token.property{ color: rgb(187,137,0); }
.token.punctuation{ color: yellow; }
.token.function{ color: rgb(42,161,152); }

/* rotate a little bit */
html{
  perspective: 1000px;
}
.styleEditor {
  position: fixed; left: 0; top: 0;
  -webkit-transition: none;
  transition: none;
  -webkit-transform: rotateY(10deg) translateZ(-100px) ;
          transform: rotateY(10deg) translateZ(-100px) ;
  
}

/* Seems something wrong here 
* emmmmmm.
* change a little bit 
* seems better.
*/
.styleEditor {
  box-shadow: 0px 0px 10px rgba(255,255,255,0.4);
}

/* Now, we need an editor */
 .resumeEditor{
    white-space: normal;
    padding: .5em;  margin: .5em;
    border: 1px solid;
    background: white; color: #222;
    overflow: auto;
 }
@media(min-width: 500px) {
  .resumeEditor{
    position: fixed; right: 0; top: 0;
    width: 48vw; 
    height: 90vh;
  }
}
@media screen and (min-width: 320px) and (max-width: 480px) {
  .resumeEditor{
    position: fixed; left: 0; top: 50vh;
    padding: .5em;  margin: .5em;
    width: 90vw; 
    height: 45vh;
  }
}

/* Greate, time for our resume */
`,
  `
/* Well, seems not friendly to HR
 * emmmm.. It's Markdown style
 * Ok, change it.
 */
`,
  `
/* Add more HTML style */
.resumeEditor{
  padding: 2em;
}
.resumeEditor h2{
  display: inline-block;
  border-bottom: 1px solid;
  margin: 1em 0 .5em;
}
.resumeEditor ul,.resumeEditor ol{
  list-style: none;
}
.resumeEditor ul> li::before{
  content: '•';
  margin-right: .5em;
}
.resumeEditor ol {
  counter-reset: section;
}
.resumeEditor ol li::before {
  counter-increment: section;
  content: counters(section, ".") " ";
  margin-right: .5em;
}
.resumeEditor blockquote {
  margin: 1em;
  padding: .5em;
  background: #ddd;
}
`
];

const resume = `Personal Information
----
Name：Sheng Zhang<br>
Education：Master of Science, University of California, Los Angeles<br>
Email：zhsheng12@gmail.com<br>

Skills
----
Java, Python, JavaScript

Experience
----
### Amazon Corp, Software Engineer Intern <br>
Jun 2017 - Sept 2017<br>
Designed a REST server to fetch and compute problematic history data from S3. Also implemented pricing error rule debugging interface for debugging purpose.<br>
Reduced the fetching time from 8s to average 100ms, made server more robust.<br>
<br>

Project Experience @UCLA
----
### Application on ElasticSearch Engine <br>
Implemented a simple Java crawler that can get website information back. Also indexing and querying documents with ElasticSearch<br>
Implemented custom ranking function as ElasticSearch plugin. Also improved dictionary based spell corrector precision from 60% to 74%.<br>

---
### eBay Bidding<br>
Developed a Web system manages data at the back-end in MySQL, which allows users to search and navigate eBay bidding data.<br>
Created a user-friendly auction search Web service and Web site, implemented ItemServlet and SearchServlet for basic website search.<br>

Objective
----
Hoping to find a role in Software Development Engineer.<br>

Thanks
----
* [GitHub](https://github.com/ShengZhang2016)
`;

let currentStyle='';
let currentMarkdown='';
let speed=10;
let nowLength=0;
let allLength=0;

class App extends Component {

  constructor(...prop) {
    super(...prop);
    this.state={
      styleTextDom:'',
      resumeMarkdownDom:''
    }
  };

  componentDidMount () {
    // some reference https://segmentfault.com/a/1190000003985390
    // immediately invoked function
    (async (that) => {
      await this.ShowStyle(0);
      await this.ShowResume();
      await this.ShowStyle(1);
      await this.ShowStyle(2)
    })(this)
  };

  ShowStyle(n) {
    return new Promise((resolve, reject) => {
      let interval = speed;
      for (let i = 0; i <= n; i++) {
        allLength += styleText[i].length;
      }
      let showStyle = (async function () {
        let style = styleText[n];
        if (!style) {
          // which means no content to be print
          return;
        }
        nowLength = allLength - style.length;
        if (currentStyle.length < allLength) {
          let i = currentStyle.length - nowLength;
          currentStyle += style.slice(i, i + 1) || ' ';
          this.setState({ styleTextDom: Prism.highlight(currentStyle, Prism.languages.css) });
          this.refs.styleEditor.scrollTop = this.refs.styleEditor.scrollHeight;
          setTimeout(showStyle, interval)
        } else {
          // set length back to 0.
          allLength =0;
          resolve()
        }
      }).bind(this);
      showStyle();
    })
  };

  ShowResume() {
    return new Promise((resolve, reject) => {
      let length = resume.length;
      let interval = speed;
      let showResumeMd = () => {
        if (currentMarkdown.length < length) {
          let i = currentMarkdown.length;
          currentMarkdown += resume.slice(i, i + 1) || ' ';
          const converter = new showdown.Converter();
          const markdownResume = converter.makeHtml(currentMarkdown);
          this.setState({ resumeMarkdownDom: markdownResume });
          this.refs.resumeEditor.scrollTop = this.refs.resumeEditor.scrollHeight;
          setTimeout(showResumeMd, interval)
        } else {
          resolve()
        }
      };
      showResumeMd()
    })
  };

  render() {
    return (
      <div className="App" >
        <div ref='styleEditor' className='styleEditor'>
          <div dangerouslySetInnerHTML={{ __html: this.state.styleTextDom }}/>
          <style dangerouslySetInnerHTML={{ __html: currentStyle }}/>
        </div>
        <div ref='resumeEditor' className='resumeEditor'>
          <div dangerouslySetInnerHTML={{ __html: this.state.resumeMarkdownDom }}/>
        </div>
      </div >
    );
  }
}

export default App;
