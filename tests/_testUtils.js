export const randomName = () => {
    let string = btoa(Math.random())
            .toLowerCase()
            .replace(/[^a-z]+/g, ""),
        length = string.length / 2;
    return string.slice(0, length) + "-" + string.slice(length);
};

export const till = async (time) => new Promise(resolve => setTimeout(resolve, time || 300));

/*
    stack overflow format html string
 */
export function formatXML(xmlString, indent) {
    indent = indent || "\t"; //can be specified by second argument of the function

    var tabs = "";  //store the current indentation

    return xmlString.replace(
        /\s*<[^>\/]*>[^<>]*<\/[^>]*>|\s*<.+?>|\s*[^<]+/g, //pattern to match nodes (angled brackets or text)
        function (m, i) {
            m = m.replace(/^\s+|\s+$/g, "");  //trim the match just in case

            if (i < 38)
                if (/^<[?]xml/.test(m)) return m + "\n";  //if the match is a header, ignore it

            if (/^<[/]/.test(m))  //if the match is a closing tag
            {
                tabs = tabs.replace(indent, "");  //remove one indent from the store
                m = tabs + m;  //add the tabs at the beginning of the match
            } else if (/<.*>.*<\/.*>|<.*[^>]\/>/.test(m))  //if the match contains an entire node
            {
                //leave the store as is or
                // m = m.replace(/(<[^\/>]*)><[\/][^>]*>/g, "$1 />");  //join opening with closing tags of the same node to one entire node if no content is between them
                m = tabs + m; //add the tabs at the beginning of the match
            } else if (/<.*>/.test(m)) //if the match starts with an opening tag and does not contain an entire node
            {
                m = tabs + m;  //add the tabs at the beginning of the match
                tabs += indent;  //and add one indent to the store
            } else  //if the match contain a text node
            {
                m = tabs + m;  // add the tabs at the beginning of the match
            }

            //return m+"\n";
            //"\n" +
            return m; //content has additional space(match) from header
        }//anonymous function

    );//replace
}


let mapObjectToHTMLAttributes = (attributes) =>
    attributes ? Object.entries(attributes).reduce((previous, current) =>
        previous + ` ${current[0]}='${

            typeof current[1] === 'object' ? JSON.stringify(current[1]) : current[1]

            }'`, ""
    ) : "";


const TESTING_LIB = false;

export const mount = async ({tag, Component, mountPoint, attributes = {}, children}) => {

    tag = tag || randomName();

    mountPoint = mountPoint || document.createElement("div");

    let attrs = mapObjectToHTMLAttributes(attributes);

    mountPoint.innerHTML = (`<${tag} ${attrs || ""}>${children || ""}</${tag}>`);

    document.body.appendChild(mountPoint);

    let node = mountPoint.firstChild;
    await node.mounted;

    await TESTING_LIB ? till(500) : false; // the lib doesnt remove the requestAnimationFrame, so you gotta wait a bit longer

    // await till(); //wait till the visibility classname is added;

    let select = (selector) => (node.shadowRoot || node).querySelector(selector);

    let click = (selector) => select(selector).dispatchEvent(new CustomEvent('click', {bubbles: true, composed: true}));


    return {
        tag,
        mountPoint,
        select,
        click,
        node, // the actual web component reference
        shadowSnapshot: () => formatXML((node.shadowRoot || node).innerHTML), // '<h1></h1>' returns what is rendered inside the web component / slots
        lightDomSnapshot: () => mountPoint.innerHTML, //`<${tag} class="___"></${tag}>` returns the "light dom" / the web component tag and light dom children
        slots: (node.shadowRoot || node).querySelectorAll('slot'),
        getSlotContent: (slot_id = "slot-0", node) => node.shadowRoot.getElementById(slot_id).parentNode.innerHTML
    }
};