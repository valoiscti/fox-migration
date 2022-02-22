USETEXTLINKS = 1
STARTALLOPEN = 1
USEFRAMES = 0
USEICONS = 0
WRAPTEXT = 1
PRESERVESTATE = 0
ICONPATH= "images/"

function traverse(tree, folder) {
	if(tree.hasChildNodes()) {
		if( tree.childNodes(0).childNodes.length == 0 )
			folder = folder.addChild( new Folder("<b>" + tree.tagName.charAt(0).toUpperCase() + tree.tagName.substring(1) + ": </b>"  + tree.childNodes(0).text  ));		
		else
			folder = folder.addChild( new Folder("<b>" + tree.tagName.charAt(0).toUpperCase() + tree.tagName.substring(1) + "</b>" ));
			
		folder.setState(false);
		for(var i=0; i<tree.childNodes.length; i++)
			traverse(tree.childNodes(i) , folder);
	}
	else{
		if( tree.childNodes.length > 0 ){
			folder = insFld(folder, new Folder(tree.text));
			folder.setState(false);
		}
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