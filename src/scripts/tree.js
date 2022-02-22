USETEXTLINKS = 1
STARTALLOPEN = 0
USEFRAMES = 0
USEICONS = 0
WRAPTEXT = 1
PRESERVESTATE = 1
ICONPATH= "images/"

function traverse(tree, folder) {
	if(tree.hasChildNodes()) { 
		folder = folder.addChild( new Folder("<b>" + tree.tagName + "</b>") );   	 
		for(var i=0; i<tree.childNodes.length; i++)
			traverse(tree.childNodes(i) , folder);
	}
	else{
		folder = insFld(folder, new Folder(tree.text));
	}
}

function paintTree(treeData){
	var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	xmlDoc.async="false";
	xmlDoc.loadXML(treeData);
	var t=xmlDoc.documentElement;
		
	foldersTree = new Folder("")
	traverse(t, foldersTree);
}