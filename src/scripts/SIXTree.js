/*-------------------------------------------------------------------------------------------
|     SIXTree - ECOTree.js
|--------------------------------------------------------------------------------------------
| (c) 2006 Emilio Cortegoso Lobato
|     
|     SIXTree is a javascript component for tree drawing. It implements the node positioning
|     algorithm of John Q. Walker II "Positioning nodes for General Trees".
|    
|     Basic features include:
|       - Layout features: Different node sizes, colors, link types, alignments, separations
|                          root node positions, etc...
|       - Nodes can include a title and an hyperlink, and a hidden metadata.
|       - Subtrees can be collapsed and expanded at will.
|       - Single and Multiple selection modes.
|       - Search nodes using title and metadata as well.     
|     
|     This code is free source, but you will be kind if you don't distribute modified versions
|     with the same name, to avoid version collisions. Otherwise, please hack it!
|
|     References:
|                                                                
|     Walker II, J. Q., "A Node-Positioning Algorithm for General Trees"
|	     			   Software ? Practice and Experience 10, 1980 553-561.    
|                      (Obtained from C++ User's journal. Feb. 1991)                                                                              
|					   
|     Last updated: October 26th, 2006
|     Version: 1.0
|					   
|					   
|	SIX Enhancements					   
|					   
|   - Callback functions for add, delete, modifiy   
|					   
\------------------------------------------------------------------------------------------*/

SIXNode = function (id, pid, dsc, w, h, showAddLink, showActivateLink, showDeactivateLink, c, bc, target, meta) {
	this.id = id;
	this.pid = pid;
	this.dsc = dsc;
	this.w = w;
	this.h = h;
	this.c = c;
	this.bc = bc;
	this.target = target;
	this.meta = meta;
	
	this.showAddLink = showAddLink;
	this.showActivateLink = showActivateLink;
	this.showDeactivateLink = showDeactivateLink;
	
	this.siblingIndex = 0;
	this.dbIndex = 0;
	
	this.XPosition = 0;
	this.YPosition = 0;
	this.prelim = 0;
	this.modifier = 0;
	this.leftNeighbor = null;
	this.rightNeighbor = null;
	this.nodeParent = null;	
	this.nodeChildren = [];
	
	this.isCollapsed = false;
	this.canCollapse = false;
	
	this.isSelected = false;
}

SIXNode.prototype._getLevel = function () {
	if (this.nodeParent.id == -1) {return 0;}
	else return this.nodeParent._getLevel() + 1;
}

SIXNode.prototype._isAncestorCollapsed = function () {
	if (this.nodeParent.isCollapsed) { return true; }
	else 
	{
		if (this.nodeParent.id == -1) { return false; }
		else	{ return this.nodeParent._isAncestorCollapsed(); }
	}
}

SIXNode.prototype._setAncestorsExpanded = function () {
	if (this.nodeParent.id == -1) { return; }
	else 
	{
		this.nodeParent.isCollapsed = false;
		return this.nodeParent._setAncestorsExpanded(); 
	}	
}

SIXNode.prototype._getChildrenCount = function () {
	if (this.isCollapsed) return 0;
    if(this.nodeChildren == null)
        return 0;
    else
        return this.nodeChildren.length;
}

SIXNode.prototype._getLeftSibling = function () {
    if(this.leftNeighbor != null && this.leftNeighbor.nodeParent == this.nodeParent)
        return this.leftNeighbor;
    else
        return null;	
}

SIXNode.prototype._getRightSibling = function () {
    if(this.rightNeighbor != null && this.rightNeighbor.nodeParent == this.nodeParent)
        return this.rightNeighbor;
    else
        return null;	
}

SIXNode.prototype._getChildAt = function (i) {
	return this.nodeChildren[i];
}

SIXNode.prototype._getChildrenCenter = function (tree) {
    node = this._getFirstChild();
    node1 = this._getLastChild();
    return node.prelim + ((node1.prelim - node.prelim) + tree._getNodeSize(node1)) / 2;	
}

SIXNode.prototype._getFirstChild = function () {
	return this._getChildAt(0);
}

SIXNode.prototype._getLastChild = function () {
	return this._getChildAt(this._getChildrenCount() - 1);
}

SIXNode.prototype._drawChildrenLinks = function (tree) {
	var s = [];
	var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0;
	var node1 = null;
	
	switch(tree.config.iRootOrientation)
	{
		case SIXTree.RO_TOP:
			xa = this.XPosition + (this.w / 2);
			ya = this.YPosition + this.h;
			break;
			
		case SIXTree.RO_BOTTOM:
			xa = this.XPosition + (this.w / 2);
			ya = this.YPosition;
			break;
			
		case SIXTree.RO_RIGHT:
			xa = this.XPosition;
			ya = this.YPosition + (this.h / 2);		
			break;
			
		case SIXTree.RO_LEFT:
			xa = this.XPosition + this.w;
			ya = this.YPosition + (this.h / 2);		
			break;		
	}
	
	for (var k = 0; k < this.nodeChildren.length; k++)
	{
		node1 = this.nodeChildren[k];
				
		switch(tree.config.iRootOrientation)
		{
			case SIXTree.RO_TOP:
				xd = xc = node1.XPosition + (node1.w / 2);
				yd = node1.YPosition;
				xb = xa;
				switch (tree.config.iNodeJustification)
				{
					case SIXTree.NJ_TOP:
						yb = yc = yd - tree.config.iLevelSeparation / 2;
						break;
					case SIXTree.NJ_BOTTOM:
						yb = yc = ya + tree.config.iLevelSeparation / 2;
						break;
					case SIXTree.NJ_CENTER:
						yb = yc = ya + (yd - ya) / 2;
						break;
				}
				break;
				
			case SIXTree.RO_BOTTOM:
				xd = xc = node1.XPosition + (node1.w / 2);
				yd = node1.YPosition + node1.h;
				xb = xa;
				switch (tree.config.iNodeJustification)
				{
					case SIXTree.NJ_TOP:
						yb = yc = yd + tree.config.iLevelSeparation / 2;
						break;
					case SIXTree.NJ_BOTTOM:
						yb = yc = ya - tree.config.iLevelSeparation / 2;
						break;
					case SIXTree.NJ_CENTER:
						yb = yc = yd + (ya - yd) / 2;
						break;
				}				
				break;

			case SIXTree.RO_RIGHT:
				xd = node1.XPosition + node1.w;
				yd = yc = node1.YPosition + (node1.h / 2);	
				yb = ya;
				switch (tree.config.iNodeJustification)
				{
					case SIXTree.NJ_TOP:
						xb = xc = xd + tree.config.iLevelSeparation / 2;
						break;
					case SIXTree.NJ_BOTTOM:
						xb = xc = xa - tree.config.iLevelSeparation / 2;
						break;
					case SIXTree.NJ_CENTER:
						xb = xc = xd + (xa - xd) / 2;
						break;
				}								
				break;		
				
			case SIXTree.RO_LEFT:
				xd = node1.XPosition;
				yd = yc = node1.YPosition + (node1.h / 2);		
				yb = ya;
				switch (tree.config.iNodeJustification)
				{
					case SIXTree.NJ_TOP:
						xb = xc = xd - tree.config.iLevelSeparation / 2;
						break;
					case SIXTree.NJ_BOTTOM:
						xb = xc = xa + tree.config.iLevelSeparation / 2;
						break;
					case SIXTree.NJ_CENTER:
						xb = xc = xa + (xd - xa) / 2;
						break;
				}								
				break;				
		}		
		
		switch(tree.render)
		{
		
			case "CANVAS":
				tree.ctx.save();
				tree.ctx.strokeStyle = tree.config.linkColor;
				tree.ctx.beginPath();			
				switch (tree.config.linkType)
				{
					case "M":						
						tree.ctx.moveTo(xa,ya);
						tree.ctx.lineTo(xb,yb);
						tree.ctx.lineTo(xc,yc);
						tree.ctx.lineTo(xd,yd);						
						break;
						
					case "B":
						tree.ctx.moveTo(xa,ya);
						tree.ctx.bezierCurveTo(xb,yb,xc,yc,xd,yd);	
						break;					
				}
				tree.ctx.stroke();
				tree.ctx.restore();
				break;
											
			case "VML":
				switch (tree.config.linkType)
				{
					case "M":
						s.push('<v:polyline points="');
						s.push(xa + ' ' + ya + ' ' + xb + ' ' + yb + ' ' + xc + ' ' + yc + ' ' + xd + ' ' + yd); 		
						s.push('" strokecolor="'+tree.config.linkColor+'"><v:fill on="false" /></v:polyline>');					
						break;
					case "B":
						s.push('<v:curve from="');
						s.push(xa + ' ' + ya + '" control1="' + xb + ' ' + yb + '" control2="' + xc + ' ' + yc + '" to="' + xd + ' ' + yd); 		
						s.push('" strokecolor="'+tree.config.linkColor+'"><v:fill on="false" /></v:curve>');					
						break;					
				}
				break;
				
		}			
	}	
	
	return s.join('');
}

SIXTree = function (obj, elm) {
	this.config = {
		iMaxDepth : 100,
		iLevelSeparation : 40,
		iSiblingSeparation : 40,
		iSubtreeSeparation : 80,
		iRootOrientation : SIXTree.RO_TOP,
		iNodeJustification : SIXTree.NJ_TOP,
		topXAdjustment : 0,
		topYAdjustment : 0,		
		render : "CANVAS",
		linkType : "M",
		linkColor : "black",
		nodeColor : "#CCCCFF",
		nodeFill : SIXTree.NF_FLAT,
		nodeBorderColor : "blue",
		nodeSelColor : "#FFFFCC",
		levelColors : ["#5555FF","#8888FF","#AAAAFF","#CCCCFF"],
		levelBorderColors : ["#5555FF","#8888FF","#AAAAFF","#CCCCFF"],
		colorStyle : SIXTree.CS_NODE,
		useTarget : true,
		searchMode : SIXTree.SM_DSC,
		selectMode : SIXTree.SL_MULTIPLE,
		defaultNodeWidth : 100,
		defaultNodeHeight : 85,
		defaultTarget : 'javascript:void(0);',
		expandedImage : 'images/ecoless.gif',
		collapsedImage : 'images/ecoplus.gif',
		transImage : 'images/ecotrans.gif'
	}
	
	this.version = "1.1";
	this.obj = obj;
	this.elm = document.getElementById(elm);
	this.self = this;
	this.render = (this.config.render == "AUTO" ) ? SIXTree._getAutoRenderMode() : this.config.render;
	this.ctx = null;
	this.canvasoffsetTop = 10;
	this.canvasoffsetLeft = 10;
	
	this.maxLevelHeight = [];
	this.maxLevelWidth = [];
	this.previousLevelNode = [];
	
	this.rootYOffset = 0;
	this.rootXOffset = 0;
	
	this.nDatabaseNodes = [];
	this.mapIDs = {};
	
	this.root = new SIXNode(-1, null, null, 2, 2);
	this.iSelectedNode = -1;
	this.iLastSearch = 0;
	
}

//Constant values

//Tree orientation
SIXTree.RO_TOP = 0;
SIXTree.RO_BOTTOM = 1;
SIXTree.RO_RIGHT = 2;
SIXTree.RO_LEFT = 3;

//Level node alignment
SIXTree.NJ_TOP = 0;
SIXTree.NJ_CENTER = 1;
SIXTree.NJ_BOTTOM = 2;

//Node fill type
SIXTree.NF_GRADIENT = 0;
SIXTree.NF_FLAT = 1;

//Colorizing style
SIXTree.CS_NODE = 0;
SIXTree.CS_LEVEL = 1;

//Search method: Title, metadata or both
SIXTree.SM_DSC = 0;
SIXTree.SM_META = 1;
SIXTree.SM_BOTH = 2;

//Selection mode: single, multiple, no selection
SIXTree.SL_MULTIPLE = 0;
SIXTree.SL_SINGLE = 1;
SIXTree.SL_NONE = 2;


SIXTree._getAutoRenderMode = function() {
	var r = "VML";
	var is_ie6 = /msie 6\.0/i.test(navigator.userAgent);
	var is_ff = /Firefox/i.test(navigator.userAgent);	
	if (is_ff) r = "CANVAS";
	return r;
}

//CANVAS functions...
SIXTree._roundedRect = function (ctx,x,y,width,height,radius) {
  ctx.beginPath();
  ctx.moveTo(x,y+radius);
  ctx.lineTo(x,y+height-radius);
  ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
  ctx.lineTo(x+width-radius,y+height);
  ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  ctx.lineTo(x+width,y+radius);
  ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
  ctx.lineTo(x+radius,y);
  ctx.quadraticCurveTo(x,y,x,y+radius);
  ctx.fill();
  ctx.stroke();
}

SIXTree._canvasNodeClickHandler = function (tree,target,nodeid) {
	if (target != nodeid) return;
	tree.selectNode(nodeid,true);
}

//Layout algorithm
SIXTree._firstWalk = function (tree, node, level) {
		var leftSibling = null;
		
        node.XPosition = 0;
        node.YPosition = 0;
        node.prelim = 0;
        node.modifier = 0;
        node.leftNeighbor = null;
        node.rightNeighbor = null;
        tree._setLevelHeight(node, level);
        tree._setLevelWidth(node, level);
        tree._setNeighbors(node, level);
        if(node._getChildrenCount() == 0 || level == tree.config.iMaxDepth)
        {
            leftSibling = node._getLeftSibling();
            if(leftSibling != null)
                node.prelim = leftSibling.prelim + tree._getNodeSize(leftSibling) + tree.config.iSiblingSeparation;
            else
                node.prelim = 0;
        } 
        else
        {
            var n = node._getChildrenCount();
            for(var i = 0; i < n; i++)
            {
                var iChild = node._getChildAt(i);
                SIXTree._firstWalk(tree, iChild, level + 1);
            }

            var midPoint = node._getChildrenCenter(tree);
            midPoint -= tree._getNodeSize(node) / 2;
            leftSibling = node._getLeftSibling();
            if(leftSibling != null)
            {
                node.prelim = leftSibling.prelim + tree._getNodeSize(leftSibling) + tree.config.iSiblingSeparation;
                node.modifier = node.prelim - midPoint;
                SIXTree._apportion(tree, node, level);
            } 
            else
            {            	
                node.prelim = midPoint;
            }
        }	
}

SIXTree._apportion = function (tree, node, level) {
        var firstChild = node._getFirstChild();
        var firstChildLeftNeighbor = firstChild.leftNeighbor;
        var j = 1;
        for(var k = tree.config.iMaxDepth - level; firstChild != null && firstChildLeftNeighbor != null && j <= k;)
        {
            var modifierSumRight = 0;
            var modifierSumLeft = 0;
            var rightAncestor = firstChild;
            var leftAncestor = firstChildLeftNeighbor;
            for(var l = 0; l < j; l++)
            {
                rightAncestor = rightAncestor.nodeParent;
                leftAncestor = leftAncestor.nodeParent;
                modifierSumRight += rightAncestor.modifier;
                modifierSumLeft += leftAncestor.modifier;
            }

            var totalGap = (firstChildLeftNeighbor.prelim + modifierSumLeft + tree._getNodeSize(firstChildLeftNeighbor) + tree.config.iSubtreeSeparation) - (firstChild.prelim + modifierSumRight);
            if(totalGap > 0)
            {
                var subtreeAux = node;
                var numSubtrees = 0;
                for(; subtreeAux != null && subtreeAux != leftAncestor; subtreeAux = subtreeAux._getLeftSibling())
                    numSubtrees++;

                if(subtreeAux != null)
                {
                    var subtreeMoveAux = node;
                    var singleGap = totalGap / numSubtrees;
                    for(; subtreeMoveAux != leftAncestor; subtreeMoveAux = subtreeMoveAux._getLeftSibling())
                    {
                        subtreeMoveAux.prelim += totalGap;
                        subtreeMoveAux.modifier += totalGap;
                        totalGap -= singleGap;
                    }

                }
            }
            j++;
            if(firstChild._getChildrenCount() == 0)
                firstChild = tree._getLeftmost(node, 0, j);
            else
                firstChild = firstChild._getFirstChild();
            if(firstChild != null)
                firstChildLeftNeighbor = firstChild.leftNeighbor;
        }
}

SIXTree._secondWalk = function (tree, node, level, X, Y) {
        if(level <= tree.config.iMaxDepth)
        {
            var xTmp = tree.rootXOffset + node.prelim + X;
            var yTmp = tree.rootYOffset + Y;
            var maxsizeTmp = 0;
            var nodesizeTmp = 0;
            var flag = false;
            
            switch(tree.config.iRootOrientation)
            {            
	            case SIXTree.RO_TOP:
	            case SIXTree.RO_BOTTOM:	        	            	    	
	                maxsizeTmp = tree.maxLevelHeight[level];
	                nodesizeTmp = node.h;	                
	                break;

	            case SIXTree.RO_RIGHT:
	            case SIXTree.RO_LEFT:            
	                maxsizeTmp = tree.maxLevelWidth[level];
	                flag = true;
	                nodesizeTmp = node.w;
	                break;
            }
            switch(tree.config.iNodeJustification)
            {
	            case SIXTree.NJ_TOP:
	                node.XPosition = xTmp;
	                node.YPosition = yTmp;
	                break;
	
	            case SIXTree.NJ_CENTER:
	                node.XPosition = xTmp;
	                node.YPosition = yTmp + (maxsizeTmp - nodesizeTmp) / 2;
	                break;
	
	            case SIXTree.NJ_BOTTOM:
	                node.XPosition = xTmp;
	                node.YPosition = (yTmp + maxsizeTmp) - nodesizeTmp;
	                break;
            }
            if(flag)
            {
                var swapTmp = node.XPosition;
                node.XPosition = node.YPosition;
                node.YPosition = swapTmp;
            }
            switch(tree.config.iRootOrientation)
            {
	            case SIXTree.RO_BOTTOM:
	                node.YPosition = -node.YPosition - nodesizeTmp;
	                break;
	
	            case SIXTree.RO_RIGHT:
	                node.XPosition = -node.XPosition - nodesizeTmp;
	                break;
            }
            if(node._getChildrenCount() != 0)
                SIXTree._secondWalk(tree, node._getFirstChild(), level + 1, X + node.modifier, Y + maxsizeTmp + tree.config.iLevelSeparation);
            var rightSibling = node._getRightSibling();
            if(rightSibling != null)
                SIXTree._secondWalk(tree, rightSibling, level, X, Y);
        }	
}

SIXTree.prototype._positionTree = function () {	
	this.maxLevelHeight = [];
	this.maxLevelWidth = [];			
	this.previousLevelNode = [];		
	SIXTree._firstWalk(this.self, this.root, 0);
	
	switch(this.config.iRootOrientation)
	{            
	    case SIXTree.RO_TOP:
	    case SIXTree.RO_LEFT: 
	    		this.rootXOffset = this.config.topXAdjustment + this.root.XPosition;
	    		this.rootYOffset = this.config.topYAdjustment + this.root.YPosition;
	        break;    
	        
	    case SIXTree.RO_BOTTOM:	
	    case SIXTree.RO_RIGHT:             
	    		this.rootXOffset = this.config.topXAdjustment + this.root.XPosition;
	    		this.rootYOffset = this.config.topYAdjustment + this.root.YPosition;
	}	
	
	SIXTree._secondWalk(this.self, this.root, 0, 0, 0);	
}

SIXTree.prototype._setLevelHeight = function (node, level) {	
	if (this.maxLevelHeight[level] == null) 
		this.maxLevelHeight[level] = 0;
    if(this.maxLevelHeight[level] < node.h)
        this.maxLevelHeight[level] = node.h;	
}

SIXTree.prototype._setLevelWidth = function (node, level) {
	if (this.maxLevelWidth[level] == null) 
		this.maxLevelWidth[level] = 0;
    if(this.maxLevelWidth[level] < node.w)
        this.maxLevelWidth[level] = node.w;		
}

SIXTree.prototype._setNeighbors = function(node, level) {
    node.leftNeighbor = this.previousLevelNode[level];
    if(node.leftNeighbor != null)
        node.leftNeighbor.rightNeighbor = node;
    this.previousLevelNode[level] = node;	
}

SIXTree.prototype._getNodeSize = function (node) {
    switch(this.config.iRootOrientation)
    {
    case SIXTree.RO_TOP: 
    case SIXTree.RO_BOTTOM: 
        return node.w;

    case SIXTree.RO_RIGHT: 
    case SIXTree.RO_LEFT: 
        return node.h;
    }
    return 0;
}

SIXTree.prototype._getLeftmost = function (node, level, maxlevel) {
    if(level >= maxlevel) return node;
    if(node._getChildrenCount() == 0) return null;
    
    var n = node._getChildrenCount();
    for(var i = 0; i < n; i++)
    {
        var iChild = node._getChildAt(i);
        var leftmostDescendant = this._getLeftmost(iChild, level + 1, maxlevel);
        if(leftmostDescendant != null)
            return leftmostDescendant;
    }

    return null;	
}

SIXTree.prototype._selectNodeInt = function (dbindex, flagToggle) {
	if (this.config.selectMode == SIXTree.SL_SINGLE)
	{
		if ((this.iSelectedNode != dbindex) && (this.iSelectedNode != -1))
		{
			this.nDatabaseNodes[this.iSelectedNode].isSelected = false;
		}		
		this.iSelectedNode = (this.nDatabaseNodes[dbindex].isSelected && flagToggle) ? -1 : dbindex;
	}	
	this.nDatabaseNodes[dbindex].isSelected = (flagToggle) ? !this.nDatabaseNodes[dbindex].isSelected : true;	
}

SIXTree.prototype._collapseAllInt = function (flag) {
	var node = null;
	for (var n = 0; n < this.nDatabaseNodes.length; n++)
	{ 
		node = this.nDatabaseNodes[n];
		if (node.canCollapse) node.isCollapsed = flag;
	}	
	this.UpdateTree();
}

SIXTree.prototype._selectAllInt = function (flag) {
	var node = null;
	for (var k = 0; k < this.nDatabaseNodes.length; k++)
	{ 
		node = this.nDatabaseNodes[k];
		node.isSelected = flag;
	}	
	this.iSelectedNode = -1;
	this.UpdateTree();
}

SIXTree.prototype._drawTree = function () {
	var s = [];
	var node = null;
	var color = "";
	var border = "";
			
	for (var n = 0; n < this.nDatabaseNodes.length; n++)
	{ 
		node = this.nDatabaseNodes[n];
		
		switch (this.config.colorStyle) {
			case SIXTree.CS_NODE:
				color = node.c;
				border = node.bc;
				break;
			case SIXTree.CS_LEVEL:
				var iColor = node._getLevel() % this.config.levelColors.length;
				color = this.config.levelColors[iColor];
				iColor = node._getLevel() % this.config.levelBorderColors.length;
				border = this.config.levelBorderColors[iColor];
				break;
		}
		
		if (!node._isAncestorCollapsed())
		{
			switch (this.render)
			{
				case "CANVAS":
					//Canvas part...
					this.ctx.save();
					this.ctx.strokeStyle = border;
					switch (this.config.nodeFill) {
						case SIXTree.NF_GRADIENT:							
							var lgradient = this.ctx.createLinearGradient(node.XPosition,0,node.XPosition+node.w,0);
							lgradient.addColorStop(0.0,((node.isSelected)?this.config.nodeSelColor:color));
							lgradient.addColorStop(1.0,"#F5FFF5");
							this.ctx.fillStyle = lgradient;
							break;
							
						case SIXTree.NF_FLAT:
							this.ctx.fillStyle = ((node.isSelected)?this.config.nodeSelColor:color);
							break;
					}					
					
					SIXTree._roundedRect(this.ctx,node.XPosition,node.YPosition,node.w,node.h,5);
					this.ctx.restore();
					
					//HTML part...
					s.push('<div id="' + node.id + '" class="sixnode" style="top:'+(node.YPosition+this.canvasoffsetTop)+'px; left:'+(node.XPosition+this.canvasoffsetLeft)+'px; width:'+node.w+'px; height:'+node.h+'px;position:absolute;" ');
					if (this.config.selectMode != SIXTree.SL_NONE)											
						s.push('onclick="javascript:SIXTree._canvasNodeClickHandler('+this.obj+',event.target.id,\''+node.id+'\');" ');										
					s.push('>');
					s.push('<font face=Verdana size=1>');					
					if (node.canCollapse) {
						s.push('<a id="c' + node.id + '" href="javascript:'+this.obj+'.collapseNode(\''+node.id+'\', true);" >');
						s.push('<img border=0 src="'+((node.isCollapsed) ? this.config.collapsedImage : this.config.expandedImage)+'" >');							
						s.push('</a>');
						s.push('<img src="'+this.config.transImage+'" >');						
					}					
					if (node.target && this.config.useTarget)
					{
						s.push('<a href="javascript:editNode(\''+node.id+'\');" >');
						s.push(node.dsc);							
						s.push('</a>');
					}				
					else
					{						
						s.push(node.dsc);
					}
					
					s.push('<br />');
					s.push('<br />');
					
					if (node.showAddLink) {
						s.push('<a href="javascript:addSubNode(\''+node.id+'\');" >');
						s.push('add');							
						s.push('</a> ');
					}
					
					s.push('<a href="javascript:deleteNode(\''+node.id+'\');" >');
					s.push('delete');							
					s.push('</a> ');
					
					if (node.showDeactivateLink) {
						s.push('<a href="javascript:deactivateNode(\''+node.id+'\');" >');
						s.push('deactivate');							
						s.push('</a> ');
 					}
					
					if (node.showActivateLink) {
						s.push('<a href="javascript:activateNode(\''+node.id+'\');" >');
						s.push('activate');							
						s.push('</a> ');
 					}
					
					s.push('</font>');
					s.push('</div>');		
					break;
					
				case "VML":
					s.push('<v:roundrect id="' + node.id + '" strokecolor="'+border+'" arcsize="0.18"	');
					s.push('style="position:absolute; top:'+node.YPosition+'; left:'+node.XPosition+'; width:'+node.w+'; height:'+node.h+'" ');
					if (this.config.selectMode != SIXTree.SL_NONE)
						s.push('href="javascript:'+this.obj+'.selectNode(\''+node.id+'\', true);" ');										
					s.push('>');
					s.push('<v:textbox inset="0.5px,0.5px,0.5px,0.5px" ><font face=Verdana size=1>');
					if (node.canCollapse) {
						s.push('<a href="javascript:'+this.obj+'.collapseNode(\''+node.id+'\', true);" >');
						s.push('<img border=0 src="'+((node.isCollapsed) ? this.config.collapsedImage : this.config.expandedImage)+'" >');							
						s.push('</a>');
						s.push('<img src="'+this.config.transImage+'" >');						
					}					
					if (node.target && this.config.useTarget)
					{
					
						s.push('<a href="javascript:editNode(\''+node.id+'\');" >');
						s.push(node.dsc);							
						s.push('</a>');
						
						s.push('<br />');
						s.push('<br />');
						
						if (node.showAddLink) {
							s.push('<a href="javascript:addSubNode(\''+node.id+'\');" >');
							s.push('add');							
							s.push('</a> ');
						}
						
						s.push('<a href="javascript:deleteNode(\''+node.id+'\');" >');
						s.push('delete');							
						s.push('</a> ');
						
						if (node.showDeactivateLink) {
							s.push('<a href="javascript:deactivateNode(\''+node.id+'\');" >');
							s.push('deactivate');							
							s.push('</a> ');
     					}
						
						if (node.showActivateLink) {
							s.push('<a href="javascript:activateNode(\''+node.id+'\');" >');
							s.push('activate');							
							s.push('</a> ');
     					}
						
					}				
					else
					{						
						s.push(node.dsc);									
					}
					s.push('</font></v:textbox>');											
					switch (this.config.nodeFill) {
						case SIXTree.NF_GRADIENT:
							s.push('<v:fill type=gradient color2="'+((node.isSelected)?this.config.nodeSelColor:color)+'" color="#F5FFF5" angle=90 />');	
							break;
						case SIXTree.NF_FLAT:
							s.push('<v:fill type="solid" color="'+((node.isSelected)?this.config.nodeSelColor:color)+'" />');	
							break;
					}
					s.push('<v:shadow type="single" on="true" opacity="0.7" />');					
					s.push('</v:roundrect>');																									
					break;
			}	
			if (!node.isCollapsed)	s.push(node._drawChildrenLinks(this.self));
		}
	}	
	return s.join('');	
}

SIXTree.prototype.toString = function () {	
	var s = [];
	
	this._positionTree();
	
	switch (this.render)
	{
		case "CANVAS":
			s.push('<canvas id="SIXTreecanvas" width=2000 height=2000></canvas>');
			break;
			
		case "HTML":
			s.push('<div class="maindiv">');
			s.push(this._drawTree());
			s.push('</div>');
			break;
			
		case "VML":
			s.push('<v:group coordsize="10000, 10000" coordorigin="0, 0" style="position:absolute;width=10000px;height=10000px;" >');
			s.push(this._drawTree());
			s.push('</v:group>');
			break;
	}
	
	return s.join('');
}

if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment)
{
	Range.prototype.createContextualFragment = function(html)
	{
		var frag = document.createDocumentFragment(), 
		div = document.createElement("div");
		frag.appendChild(div);
		div.outerHTML = html;
		return frag;
	};
}

// SIXTree API begins here...

SIXTree.prototype.UpdateTree = function () {	
	this.elm.innerHTML = this;
	if (this.render == "CANVAS") {
		var canvas = document.getElementById("SIXTreecanvas");
		if (canvas && canvas.getContext)  {
			this.canvasoffsetLeft = canvas.offsetLeft;
			this.canvasoffsetTop = canvas.offsetTop;
			this.ctx = canvas.getContext('2d');
			var h = this._drawTree();	
			
			// to count the number of elements that will be displayed
			var elementsCount = h.split("/div").length - 1;
			// resize of the container depending of the number of elements
			if (elementsCount > 50) {
				canvas.width  = 25000;
				canvas.height  = 10000;
			} else if (elementsCount > 15) {
				canvas.width  = 10000;
				canvas.height = 5000;
			}
			h = this._drawTree();	
			var r = this.elm.ownerDocument.createRange();
			r.setStartBefore(this.elm);
			var parsedHTML = r.createContextualFragment(h);			
			this.elm.appendChild(parsedHTML);			
		}
	}
}

SIXTree.prototype.add = function (id, pid, dsc, w, h, showAddLink, showActivateLink, showDeactivateLink, c, bc, target, meta) {	
	var nw = w || this.config.defaultNodeWidth; //Width, height, colors, target and metadata defaults...
	var nh = h || this.config.defaultNodeHeight;
	var nshowAddLink = showAddLink || false;
	var nshowActivateLink = showActivateLink || false;
	var nshowDeactivateLink = showDeactivateLink || false;
	
	var color = c || this.config.nodeColor;
	var border = bc || this.config.nodeBorderColor;
	var tg = (this.config.useTarget) ? ((typeof target == "undefined") ? (this.config.defaultTarget) : target) : null;
	var metadata = (typeof meta != "undefined")	? meta : "";
	
	var pnode = null; //Search for parent node in database
	if (pid == -1) 
		{
			pnode = this.root;
		}
	else
		{
			for (var k = 0; k < this.nDatabaseNodes.length; k++)
			{
				if (this.nDatabaseNodes[k].id == pid)
				{
					pnode = this.nDatabaseNodes[k];
					break;
				}
			}	
		}
	
	var node = new SIXNode(id, pid, dsc, nw, nh, nshowAddLink, nshowActivateLink, nshowDeactivateLink, color, border, tg, metadata);	//New node creation...
	node.nodeParent = pnode;  //Set it's parent
	pnode.canCollapse = true; //It's obvious that now the parent can collapse	
	var i = this.nDatabaseNodes.length;	//Save it in database
	node.dbIndex = this.mapIDs[id] = i;	 
	this.nDatabaseNodes[i] = node;	
	var h = pnode.nodeChildren.length; //Add it as child of it's parent
	node.siblingIndex = h;
	pnode.nodeChildren[h] = node;
}

SIXTree.prototype.searchNodes = function (str) {
	var node = null;
	var m = this.config.searchMode;
	var sm = (this.config.selectMode == SIXTree.SL_SINGLE);	 
	
	if (typeof str == "undefined") return;
	if (str == "") return;
	
	var found = false;
	var n = (sm) ? this.iLastSearch : 0;
	if (n == this.nDatabaseNodes.length) n = this.iLastSeach = 0;
	
	str = str.toLocaleUpperCase();
	
	for (; n < this.nDatabaseNodes.length; n++)
	{ 		
		node = this.nDatabaseNodes[n];				
		if (node.dsc.toLocaleUpperCase().indexOf(str) != -1 && ((m == SIXTree.SM_DSC) || (m == SIXTree.SM_BOTH))) { node._setAncestorsExpanded(); this._selectNodeInt(node.dbIndex, false); found = true; }
		if (node.meta.toLocaleUpperCase().indexOf(str) != -1 && ((m == SIXTree.SM_META) || (m == SIXTree.SM_BOTH))) { node._setAncestorsExpanded(); this._selectNodeInt(node.dbIndex, false); found = true; }
		if (sm && found) {this.iLastSearch = n + 1; break;}
	}	
	this.UpdateTree();	
}

SIXTree.prototype.selectAll = function () {
	if (this.config.selectMode != SIXTree.SL_MULTIPLE) return;
	this._selectAllInt(true);
}

SIXTree.prototype.unselectAll = function () {
	this._selectAllInt(false);
}

SIXTree.prototype.collapseAll = function () {
	this._collapseAllInt(true);
}

SIXTree.prototype.expandAll = function () {
	this._collapseAllInt(false);
}

SIXTree.prototype.collapseNode = function (nodeid, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].isCollapsed = !this.nDatabaseNodes[dbindex].isCollapsed;
	if (upd) this.UpdateTree();
}

SIXTree.prototype.selectNode = function (nodeid, upd) {		
	this._selectNodeInt(this.mapIDs[nodeid], true);
	if (upd) this.UpdateTree();
}

SIXTree.prototype.setNodeTitle = function (nodeid, title, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].dsc = title;
	if (upd) this.UpdateTree();
}

SIXTree.prototype.setNodeMetadata = function (nodeid, meta, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].meta = meta;
	if (upd) this.UpdateTree();
}

SIXTree.prototype.setNodeTarget = function (nodeid, target, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].target = target;
	if (upd) this.UpdateTree();	
}

SIXTree.prototype.setNodeColors = function (nodeid, color, border, upd) {
	var dbindex = this.mapIDs[nodeid];
	if (color) this.nDatabaseNodes[dbindex].c = color;
	if (border) this.nDatabaseNodes[dbindex].bc = border;
	if (upd) this.UpdateTree();	
}

SIXTree.prototype.getSelectedNodes = function () {
	var node = null;
	var selection = [];
	var selnode = null;	
	
	for (var n=0; n<this.nDatabaseNodes.length; n++) {
		node = this.nDatabaseNodes[n];
		if (node.isSelected)
		{			
			selnode = {
				"id" : node.id,
				"dsc" : node.dsc,
				"meta" : node.meta
			}
			selection[selection.length] = selnode;
		}
	}
	return selection;
}