if (!window.global)
    window.global = {};

var Ext = window.global.Ext,
    Designer = {
        AppData: {
            productModelData: null,
        },
    };

function getPixelValue(val) {
    return Number(val.substring(0, val.length - 2));
}
Ext.canvasController = {
    view: {
        getWidth: function () {
            if (!this.container)
                return 0;
            let style = window.getComputedStyle(this.container);
            return getPixelValue(style.width);
        },
        getHeight: function () {
            if (!this.container)
                return 0;
            let style = window.getComputedStyle(this.container);
            return getPixelValue(style.height);
        }
    },
    getView: function () {
        return this.view;
    },
    getPrefUnit: function () {
        return localStorage.getItem('prefUnit') || 'inch';
    },
    setFabricAttributes: async function () {
        if (this.fabricAttributesInit)
            return;
        this.fabricAttributesInit = true;

        // Defines the number of fraction digits to use when serializing object values.
        fabric.Object.NUM_FRACTION_DIGITS = 6;

        var objDrawControls = fabric.Object.prototype.drawControls,
            me = this;

        fabric.util.addPrototypeProps(fabric.Text, { fontFamily: 'Ubuntu' });

        // Disable WebGL image filtering.
        // Try enabling when we have shaders for BlackWhite and Tint filters in place.
        fabric.enableGLFiltering = false;
        fabric.Object.prototype.set({
            borderColor: '#3399FF',
            cornerStyle: 'circle',
            cornerHitTolerance: Ext.supports.TouchEvents ? 3 : 1,
            transparentCorners: false,
            rotationFeedback: true,
            scalingFeedback: true,
            feedbackFontSize: 16,
            feedbackFontColor: 'white',
            feedbackFontFamily: 'Arial',
            feedbackBackColor: 'black',
            drawControls: function (ctx, styleOverride) {
                objDrawControls.apply(this, arguments);
                if (styleOverride) {
                    this._drawRotationFeedback(ctx);
                    this._drawScalingFeedback(ctx);
                }
            },
            _drawRotationFeedback: function (ctx) {
                if (!this.rotationFeedback || !me.isRotating || this.lockRotation) {
                    return;
                }
                ctx.save();
                var fontSize = this.feedbackFontSize;
                var fontFamily = this.feedbackFontFamily;
                var angle = this.angle.toFixed(0);
                angle %= 360;
                if (angle < 0) {
                    angle += 360;
                }
                var rotationText = angle + '\u00b0';

                ctx.globalAlpha = 1;
                ctx.font = fontSize + 'px ' + fontFamily;

                var textWidth = ctx.measureText(rotationText).width;

                ctx.rotate(-angle * Math.PI / 180);
                var rectWidth = 1.5 * ctx.measureText('360\u00b0').width;
                var rectHeight = 1.5 * fontSize;
                var rectX = -rectWidth / 2;
                var rectY = -rectHeight * 0.85 / 2;
                var cornerRadius = 5;

                ctx.lineJoin = "round";
                ctx.lineWidth = cornerRadius;

                //Draw the background rectangle.
                ctx.strokeStyle = this.feedbackBackColor;
                ctx.fillStyle = this.feedbackBackColor;
                ctx.strokeRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - cornerRadius, rectHeight - cornerRadius);
                ctx.fillRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - cornerRadius, rectHeight - cornerRadius);

                //Draw the rotation angle text.
                var x = rectX + (rectWidth - textWidth) / 2,
                    y = fontSize / 2;
                ctx.fillStyle = this.feedbackFontColor;
                ctx.fillText(rotationText, x, y);
                ctx.restore();
            },
            convertToPrefUnits: function (mm) {
                switch (me.getPrefUnit()) {
                    case 'inch':
                        return (mm / 25.4).toFixed(1);
                    default:
                        return mm.toFixed(1);
                }
            },
            _drawScalingFeedback: function (ctx) {
                if (!this.scalingFeedback || !me.isScaling || (this.lockScalingX && this.lockScalingY)) {
                    return;
                }
                ctx.save();
                var fontSize = this.feedbackFontSize;
                var fontFamily = this.feedbackFontFamily;
                var angle = this.angle.toFixed(0);
                angle %= 360;
                if (angle < 0) {
                    angle += 360;
                }
                var width = this.scaleX * this.width,
                    height = this.scaleY * this.height,
                    unit = me.getPrefUnit() == 'inch' ? 'in' : 'mm';

                var scalingText = String.format(
                    "W : {0} {1}\nH : {2} {1}",
                    this.convertToPrefUnits(width),
                    unit,
                    this.convertToPrefUnits(height)
                ).split('\n');
                ctx.globalAlpha = 1;
                ctx.font = fontSize + 'px ' + fontFamily;
                var textWidth = Math.max(ctx.measureText(scalingText[0]).width, ctx.measureText(scalingText[1]).width);

                ctx.rotate(-angle * Math.PI / 180);
                var rectWidth = 1.1 * textWidth;
                var rectHeight = 2.6 * fontSize;
                var rectX = -rectWidth / 2;
                var rectY = -rectHeight * 0.85 / 2;
                var cornerRadius = 5;

                ctx.lineJoin = "round";
                ctx.lineWidth = cornerRadius;

                //Draw the background rectangle.
                ctx.strokeStyle = this.feedbackBackColor;
                ctx.fillStyle = this.feedbackBackColor;
                ctx.strokeRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - cornerRadius, rectHeight - cornerRadius);
                ctx.fillRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - cornerRadius, rectHeight - cornerRadius);

                //Draw the scaling text.
                var x = rectX + (rectWidth - textWidth) / 2;
                ctx.fillStyle = this.feedbackFontColor;
                ctx.fillText(scalingText[0], x, 0);
                ctx.fillText(scalingText[1], x, 1.15 * fontSize);

                ctx.restore();
            }
        });

        fabric.Canvas.prototype.getLayeringTargets = function () {
            return (this.layeringTarget || this)._objects;
        };

        var mtrImage = await me.loadImage('/resources/icons/rotate.png'),
            brImage = await me.loadImage('/resources/icons/resize.png'),
            transEnable = await me.loadImage('/resources/icons/hindiTransEnable.png'),
            transDisable = await me.loadImage('/resources/icons/hindiTransDisable.png'),
            trImage = await me.loadImage('/resources/icons/trash.png');

        var renderIconControl = fabric.controlsUtils.renderIconControl;
        fabric.Object.prototype.controlsSetting.defaultControls.mtr.render = function (ctx, left, top, styleOverride, fabricObject) {
            ctx.save();
            renderIconControl.call(this, ctx, left, top, mtrImage);
            ctx.restore();
        };

        var toObject = fabric.Object.prototype.toObject;
        fabric.Object.prototype.toObject = function (propertiesToInclude) {
            var additionalProperties = [
                'allowedLeft',
                'allowedTop'
            ].concat(propertiesToInclude);
            return toObject.call(this, additionalProperties);
        }

        fabric.Object.prototype.controlsSetting.defaultControls.br.render = function (ctx, left, top, styleOverride, fabricObject) {
            ctx.save();
            renderIconControl.call(this, ctx, left, top, brImage);
            ctx.restore();
        };

        let origTrRender = fabric.Object.prototype.controlsSetting.defaultControls.tr.render;
        fabric.Object.prototype.controlsSetting.defaultControls.tr.render = function (ctx, left, top, styleOverride, fabricObject) {
            if (fabricObject.undeletable) {
                return origTrRender.apply(this, arguments);
            }
            ctx.save();
            renderIconControl.call(this, ctx, left, top, trImage);
            ctx.restore();
        };

        let origTrCursorStyle = fabric.Object.prototype.controlsSetting.defaultControls.tr.cursorStyleHandler;
        fabric.Object.prototype.controlsSetting.defaultControls.tr.cursorStyleHandler = function (eventData, control, fabricObject) {
            if (fabricObject.undeletable) {
                return origTrCursorStyle.apply(this, arguments);
            }
            return "pointer";
        };

        let origTrMouseDown = fabric.Object.prototype.controlsSetting.defaultControls.tr.mouseDownHandler;
        fabric.Object.prototype.controlsSetting.defaultControls.tr.mouseDownHandler = function (eventData, transform) {
            var fabricObject = transform.target;
            if (fabricObject.undeletable) {
                return origTrMouseDown.apply(this, arguments);
            }
            fabricObject.getParent().remove(fabricObject);
        };

        var topLeftDefault = fabric.Object.prototype.controlsSetting.defaultControls.tl.render,
            scaleStyleHandler = fabric.Object.prototype.controlsSetting.defaultControls.tl.cursorStyleHandler,
            actionHandler = fabric.Object.prototype.controlsSetting.defaultControls.tl.actionHandler,
            editIcon = await me.loadImage('/resources/icons/editmode.svg'),
            mouseDownHandler = fabric.Object.prototype.controlsSetting.defaultControls.tl.mouseDownHandler;

        fabric.Svg.prototype.disableEditing = true;
        fabric.Object.prototype.controlsSetting.defaultControls.tl.render = function (ctx, left, top, styleOverride, fabricObject) {
            if (fabricObject.disableEditing || !(fabricObject instanceof fabric.Svg)) {
                return topLeftDefault.apply(this, arguments);
            }
            ctx.save();
            renderIconControl.call(this, ctx, left, top, editIcon);
            ctx.restore();
        };
        fabric.Object.prototype.controlsSetting.defaultControls.tl.cursorStyleHandler = function (eventData, control, fabricObject) {
            if (fabricObject.disableEditing || !(fabricObject instanceof fabric.Svg)) {
                return scaleStyleHandler.apply(this, arguments);
            }
            return "pointer";
        };
        fabric.Object.prototype.controlsSetting.defaultControls.tl.mouseDownHandler = function (eventData, transform) {
            var fabricObject = transform.target;
            if (fabricObject.disableEditing || !(fabricObject instanceof fabric.Svg)) {
                return mouseDownHandler.apply(this, arguments);
            }
            var canvas = fabricObject.canvas;
            canvas.setSvgEditing(fabricObject, true);
        };
        fabric.Object.prototype.controlsSetting.defaultControls.tl.actionHandler = function (eventData, transform) {
            var fabricObject = transform.target;
            if (fabricObject.disableEditing || !(fabricObject instanceof fabric.Svg)) {
                return actionHandler.apply(this, arguments);
            }
        };
        fabric.Object.prototype.isExcludeFromExport = function () {
            return this.excludeFromExport || this.excludeSVGExport || !this.visible;
        };
        fabric.Canvas.prototype.setSvgEditing = function (targetLayer, isEditableMode) {
            targetLayer.setEditable(isEditableMode);
            this.discardActiveObject();
            if (isEditableMode) {
                if (this.layeringTarget) {
                    this.layeringTarget.setEditable(false);
                    this.layeringTarget.dirty = true;
                }
                this.layeringTarget = targetLayer;
            } else {
                this.setActiveObject(targetLayer);
                this.layeringTarget = null;
            }
            targetLayer.dirty = true;
            this.fire('layerTarget:changed', { target: targetLayer, editable: isEditableMode });
            this.renderAll();
        };

        /*var tl = Object.create(fabric.Textbox.prototype.controls.tl);
        tl.render = function (ctx, left, top, styleOverride, fabricObject) {
            ctx.save();
            var enable = fabricObject.enableTransliteration;
            renderIconControl.call(this,ctx, left, top, enable ? transEnable : transDisable);
            ctx.restore();
        }
        tl.mouseDownHandler = function (eventData, transform) {
            var fabricObject = transform.target;
            if(fabricObject && fabricObject.onTransliteration) {
                fabricObject.enableTransliteration = !fabricObject.enableTransliteration;
            }
        };
        tl.mouseUpHandler = function(eventData, transform, x, y ) { 
            var fabricObject = transform.target,
                canvas = fabricObject.canvas;
            if(fabricObject && canvas) {
                canvas.drawControls(canvas.contextContainer);
            }
        }
        tl.cursorStyleHandler = function () {
            return "pointer";
        };
        fabric.Textbox.prototype.controls.tl = tl;
        */
    },
    allowCopyDelete: function () {
        var canvas = this.canvas;
        var activeObject = canvas.getActiveObjects();

        // Enable copy and delete if we have active selection.
        var allow = Boolean(activeObject.length);
        if (allow) {
            for (var o of activeObject) {
                if (o.isLocked || o.undeletable) {
                    allow = false;
                    break;
                }
            }
        }

        return {
            'canCopy': allow,
            'canDelete': allow
        };
    },
    deleteActiveObjects: function () {
        var allowCopyDelete = this.allowCopyDelete();
        if (!allowCopyDelete.canDelete) {
            return;
        }
        this.deleteObjects(this.canvas.getActiveObjects());
    },
    deleteObjects: function (objects) {
        var canvas = this.canvas;
        if (objects && objects.length === 0) {
            return;
        }

        canvas.mute(); // Mute undo/redo handling. We notify once at end.

        canvas.discardActiveObject();
        objects.forEach(function (object) {
            object.getParent().remove(object);
        });

        canvas.unmute();
        canvas.fire('object:removed', { target: objects });
        canvas.renderAll();
    },
    restrictObject: function (target, valProp, getMaxVal, rangeProp) {
        var ranges = target[rangeProp];
        if (ranges) {
            var max = getMaxVal(),
                value = target[valProp],
                value2 = value + max,
                mid = value + max / 2,
                isAligned = false;

            for (var range of ranges) {
                if (range[0] < mid && mid < range[1]) {
                    if (range[0] > value) {
                        target[valProp] = range[0];
                    } else if (range[1] < value2) {
                        target[valProp] = range[1] - max;
                    }
                    isAligned = true;
                    break;
                }
            }
            if (!isAligned) {
                let range = ranges[0],
                    min = Number.MAX_VALUE;
                for (let r of ranges) {
                    let rMid = (r[0] + r[1]) / 2,
                        diff = Math.abs(rMid - mid);
                    if (diff < min) {
                        min = diff;
                        range = r;
                    }
                }
                if (Math.abs(range[0] - mid) > Math.abs(range[1] - mid)) {
                    target[valProp] = range[1] - max;
                } else {
                    target[valProp] = range[0];
                }
            }
        }
    },
    setCanvasAttributes: async function (canvas, previewCanvas, panCanvas) {
        // Set fabric custom attributes here
        canvas.controlsAboveOverlay = true;	// Ensures that the object selection handles draw outside margins as well

        await this.setFabricAttributes();

        // Debug
        //canvas.backgroundColor = 'orange';
        canvas.preserveObjectStacking = true;
        this.lowestFgObjectIndex = 0;
        var me = this;

        canvas.on({
            'object:rotated': function () {
                me.isRotating = false;
            },
            'object:rotating': function () {
                me.isRotating = true;
            },
            'object:scaled': function () {
                me.isScaling = false;
            },
            'object:scaling': function () {
                me.isScaling = true;
            },
            'object:moved': function ({ target }) {
                me.restrictObject(target, "left", e => target.width * target.scaleX, "allowedLeft");
                me.restrictObject(target, "top", e => target.scaleY * target.height, "allowedTop");
            }
        });

        // Set the canvas clip callback.
        canvas.clipTo = previewCanvas.clipTo = function (ctx) {
            me.clipCanvas(ctx, this);
        };

        // Set the draw custom background callback.
        canvas.renderCustomBackground = previewCanvas.renderCustomBackground = function (ctx) {
            me.drawCustomBackground(ctx, this);
        };

        // Set the draw custom overlay callback.
        canvas.renderCustomOverlay = previewCanvas.renderCustomOverlay = function (ctx) {
            me.drawCustomOverlay(ctx, this);
        };

        // Now set the main canvas only callbacks.

        // Set the object allow move callback.
        canvas.allowObjectMove = function (object, newLeft, newTop) {
            return me.allowObjectMove(object, newLeft, newTop);
        };

        canvas.removeStartingAt = function (index) {
            var objects = this._objects;
            var objectsRemoved = objects.splice(index);
            for (var i = 0, length = objectsRemoved.length; i < length; i++) {
                this._onObjectRemoved && this._onObjectRemoved(objectsRemoved[i]);
            };
            this.renderOnAddRemove && (objectsRemoved.length > 0) && this.requestRenderAll();
            return this;
        };

        // Add pan rect to the pan canvas.
        var zoomRect = new fabric.Rect({
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            hasControls: false,
            hasBorders: false,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            lockSkewingX: true,
            lockSkewingY: true,
            fill: '',
            stroke: 'red',
            strokeWidth: 1,
            deviceStroke: true,
            objectCaching: false,
            id: 'selectionRect'
        });

        panCanvas.add(zoomRect);

        zoomRect.on('moving', function (options) {
            me.transformCanvasViewport();
        });

        canvas.enumerateAllObjects = function (callback, includeGroups, descendSVG) {
            this.getObjects().forEach(function (o) {
                me.enumerateObjects(o, callback, includeGroups, descendSVG);
            });
        };
    },

    loadImage: async function (path) {
        var img = new Image();
        await new window.Promise(function (resolve, reject) {
            img.onload = resolve;
            img.onerror = reject;
            img.src = path;
        });
        return img;
    },

    enumerateObjects: function (object, callback, includeGroups, descendPathGroups) {
        var keepEnumerating = true;
        if (object.type === 'group' || (object.type === 'svg' && descendPathGroups)) {
            if (includeGroups) {
                keepEnumerating = callback(object);
            }

            var objects = object.getObjects();
            for (var i = 0, length = objects.length; keepEnumerating && i < length; i++) {
                keepEnumerating = this.enumerateObjects(objects[i], callback, includeGroups, descendPathGroups);
            }
        } else {
            keepEnumerating = callback(object);
        }

        return keepEnumerating;
    },

    recalcCanvasLayout: function () {
        // Resize the canvas to fill the entire panel.
        var canvasPanel = this.getView();

        var panelWidth = canvasPanel.getWidth();
        var panelHeight = canvasPanel.getHeight();

        if (!this.canvas) {
            return;
        }
        // Set the viewport bounds.
        this.canvas.setDimensions({
            width: panelWidth,
            height: panelHeight
        });

        this.transformCanvasViewport();
    },

    transformCanvasViewport: function () {
        var canvas = this.canvas;
        if (!canvas) {
            return;
        }
        var canvasPanel = this.getView();

        var panelWidth = canvasPanel.getWidth();
        var panelHeight = canvasPanel.getHeight();

        // Leave 5% margins on all side.
        var canvasWidth = panelWidth * 0.9;
        var canvasHeight = panelHeight * 0.9;

        // Compute the product size including negative margins, if any.
        var data = this.productSizeData;

        var productBounds = {
            left: 0,
            top: 0,
            right: data.widthMM,
            bottom: data.heightMM,
            width: data.widthMM,
            height: data.heightMM
        };

        var marginBounds = {
            left: data.leftMarginMM,
            top: data.topMarginMM,
            right: data.widthMM - data.rightMarginMM,
            bottom: data.heightMM - data.bottomMarginMM,
        };

        var totalBounds = this.getUnionBounds(productBounds, marginBounds);

        var totalWidth = totalBounds.width;
        var totalHeight = totalBounds.height;

        var rx = canvasWidth / totalWidth;
        var ry = canvasHeight / totalHeight;

        var rr = (rx < ry) ? rx : ry;

        // Scale accordingly if not drawing preview.
        if (!this.drawingPreview) {
            rr *= this.currentZoomLevel;
            panelWidth *= this.currentZoomLevel;
            panelHeight *= this.currentZoomLevel;
        }

        canvasWidth = Math.ceil(totalWidth * rr);
        canvasHeight = Math.ceil(totalHeight * rr);

        this.canvasX = (panelWidth - canvasWidth) / 2 + (totalBounds.left > 0 ? 0 : Math.abs(totalBounds.left) * rr);
        this.canvasY = (panelHeight - canvasHeight) / 2 + (totalBounds.top > 0 ? 0 : Math.abs(totalBounds.top) * rr);

        // Add adjustment for zoom rect bounds, if required.
        var panCanvas = this.panCanvas;

        var panCanvasNewWidth = Math.floor(canvas.width / this.mainToPreviewCanvasSizeRatio);
        var panCanvasNewHeight = Math.floor(canvas.height / this.mainToPreviewCanvasSizeRatio);

        var resizing = (panCanvas.width != panCanvasNewWidth || panCanvas.height != panCanvasNewHeight);
        var zoomRectBounds;
        if (!this.drawingPreview && this.panCanvas._objects.length) {
            zoomRectBounds = this.getNextZoomRectBounds({ resizing: resizing, mainCanvasScaling: rr }, totalBounds);
            this.canvasX -= (zoomRectBounds.left * this.mainToPreviewCanvasSizeRatio * this.currentZoomLevel);
            this.canvasY -= (zoomRectBounds.top * this.mainToPreviewCanvasSizeRatio * this.currentZoomLevel);
        }

        canvas.setViewportTransform([rr, 0, 0, rr, this.canvasX, this.canvasY]);

        var onMouseMove = canvas.__proto__.__onMouseMove;
        canvas.__onMouseMove = function (e) {
            let pointer = this.getPointer(e);
            if (pointer.x < 0 || pointer.y < 0 || pointer.x > data.widthMM || pointer.y > data.heightMM) {
                return;
            }
            return onMouseMove.call(this, e);
        }

        // Adjust the linked preview canvas, if required.
        if (!this.drawingPreview && this.panCanvas._objects.length) {
            this.recalcPreviewCanvasLayout(zoomRectBounds);
        }

        var productWidth = productBounds.width;
        var productHeight = productBounds.height;

        this.canvasWidth = Math.ceil(productWidth * rr);
        this.canvasHeight = Math.ceil(productHeight * rr);
    },

    getNextZoomRectBounds: function (options, totalBounds) {
        var canvas = this.canvas;
        var panCanvas = this.panCanvas;
        var zoomRect = panCanvas.getObjects()[0];

        var panCanvasWidth = Math.floor(canvas.width / this.mainToPreviewCanvasSizeRatio);
        var panCanvasHeight = Math.floor(canvas.height / this.mainToPreviewCanvasSizeRatio);

        var left = zoomRect.left,
            top = zoomRect.top;

        var zoomRectNewWidth = panCanvasWidth / this.currentZoomLevel;
        var zoomRectNewHeight = panCanvasHeight / this.currentZoomLevel;

        if (options && options.resizing) {
            left = (left / panCanvas.width) * panCanvasWidth;
            top = (top / panCanvas.height) * panCanvasHeight;
        } else {
            left += (zoomRect.width - zoomRectNewWidth) / 2;
            top += (zoomRect.height - zoomRectNewHeight) / 2;
        }

        var panelWidth = Math.floor(canvas.width / this.mainToPreviewCanvasSizeRatio);
        var previewHeight = Math.floor(canvas.height / this.mainToPreviewCanvasSizeRatio);

        var rr = options.mainCanvasScaling / (this.currentZoomLevel * this.mainToPreviewCanvasSizeRatio);
        var canvasWidth = Math.ceil(totalBounds.width * rr);
        var canvasHeight = Math.ceil(totalBounds.height * rr);

        var tx = (panelWidth - canvasWidth) / 2 + (totalBounds.left > 0 ? 0 : Math.abs(totalBounds.left) * rr);
        var ty = (previewHeight - canvasHeight) / 2 + (totalBounds.top > 0 ? 0 : Math.abs(totalBounds.top) * rr);

        if (left < 0) {
            left = 0;
        }

        if (top < 0) {
            top = 0;
        }

        if (left + zoomRectNewWidth > panCanvasWidth) {
            left = panCanvasWidth - zoomRectNewWidth;
        }

        if (top + zoomRectNewHeight > panCanvasHeight) {
            top = panCanvasHeight - zoomRectNewHeight;
        }

        return {
            left: left,
            top: top,
            width: zoomRectNewWidth,
            height: zoomRectNewHeight,
            rr: rr,
            tx: tx,
            ty: ty
        };
    },

    recalcPreviewCanvasLayout: function (zoomRectBounds) {
        var canvas = this.canvas;
        var previewCanvasContainer = this.previewCanvasContainer;

        // Compute and set the preview container dimensions.
        var panelWidth = Math.floor(canvas.width / this.mainToPreviewCanvasSizeRatio);
        var previewHeight = Math.floor(canvas.height / this.mainToPreviewCanvasSizeRatio);

        // Position the preview container.
        var padding = 20;
        previewCanvasContainer.style.left = (canvas.width - panelWidth - 2 - padding) + 'px';
        previewCanvasContainer.style.top = padding + 'px';

        // Set the dimensions for the contained canvas elements.
        var previewCanvas = this.previewCanvas;
        var panCanvas = this.panCanvas;

        previewCanvas.lowerCanvasEl.parentElement.style.height = previewHeight + 'px';
        previewCanvas.setDimensions({
            width: panelWidth,
            height: previewHeight
        });

        panCanvas.setDimensions({
            width: panelWidth,
            height: previewHeight
        });

        // Set the dimensions for container label.
        var previewCanvasLabel = this.previewCanvasLabel;
        previewCanvasLabel.style.top = previewHeight + 'px';
        previewCanvasLabel.style.width = panelWidth + 'px';
        previewCanvasLabel.style.height = '20px';

        previewCanvas.setViewportTransform([zoomRectBounds.rr, 0, 0, zoomRectBounds.rr, zoomRectBounds.tx, zoomRectBounds.ty]);

        var zoomRect = panCanvas.getObjects()[0];
        zoomRect.animate(
            {
                left: zoomRectBounds.left,
                top: zoomRectBounds.top,
                width: zoomRectBounds.width,
                height: zoomRectBounds.height
            },
            {
                duration: 200,
                onChange: panCanvas.renderAll.bind(panCanvas),
                onComplete: function () { },
                easing: fabric.util.ease.easeInQuad
            }
        );
    },

    getUnionBounds: function (a, b) {
        var bounds = {
            left: (a.left < b.left) ? a.left : b.left,
            top: (a.top < b.top) ? a.top : b.top,
            right: (a.right > b.right) ? a.right : b.right,
            bottom: (a.bottom > b.bottom) ? a.bottom : b.bottom
        };

        bounds.width = bounds.right - bounds.left;
        bounds.height = bounds.bottom - bounds.top;

        return bounds;
    },

    clipCanvas: function (ctx, canvas) {
        // The clipCanvas function gets called from fabric.js at the start of a drawing cycle.
        // This function is responsible for establishing the clip path for the drawing.

        // Do the default fill only when we don't have a custom background.
        this.drawProductOutline(ctx, canvas);

        var maskArea = this.getMaskArea(),
            marginArea = this.getMarginArea();

        var rr = canvas.viewportTransform[0];

        // Now draw the "margin" object.
        if (marginArea) {
            var data = this.productSizeData;
            marginArea.set({
                width: data.widthMM - data.leftMarginMM - data.rightMarginMM,
                height: data.heightMM - data.topMarginMM - data.bottomMarginMM
            });
            if (this.drawingPreview || (maskArea && !this.hasNegativeMargins())) {
                ctx.clip(); // For negative margins, just clip to margin.
            }

            var stroke = 'black';
            var strokeWidth = 1 / rr;
            var strokeDashArray = [5 / rr, 5 / rr];

            this.drawClipArea(ctx, marginArea, stroke, strokeWidth, strokeDashArray, false, canvas);
        }
    },

    drawProductOutline: function (ctx, canvas, doFill) {
        var maskArea = this.getMaskArea();
        var rr = canvas.viewportTransform[0];

        // The "mask" object if present, determines the model outline.
        if (maskArea) {
            var stroke = 'black';
            var strokeWidth = 1 / rr;
            var fill = false;

            if (doFill) {
                fill = 'white';
            }

            this.drawClipArea(ctx, maskArea, stroke, strokeWidth, [], fill, canvas);
        } else {
            // Otherwise, we just draw the canvas outline.
            var data = this.productSizeData;

            ctx.save();
            ctx.beginPath();
            ctx.transform.apply(ctx, canvas.viewportTransform);

            var strokeWidth = 1 / rr;
            this.roundedRect(ctx, strokeWidth / 2, strokeWidth / 2, data.widthMM - strokeWidth, data.heightMM - strokeWidth, 0);

            if (doFill) {
                ctx.fillStyle = 'white';
                ctx.fill();
            }

            ctx.strokeStyle = this.drawingPreview ? 'transparent' : 'black';
            ctx.lineWidth = 1 / rr;
            ctx.stroke();

            ctx.restore();
        }
    },

    roundedRect: function (ctx, x, y, width, height, radius) {
        // Create rounded rect path on the specified canvas 2D context.
        var r = Math.min(radius, width / 2, height / 2);

        ctx.beginPath();

        if (r) {
            // Code taken from fabric rounded rect render function.

            // "magic number" for bezier approximations of arcs
            var k = 1 - 0.5522847498;

            ctx.moveTo(x + r, y);
            ctx.lineTo(x + width - r, y);
            ctx.bezierCurveTo(x + width - k * r, y, x + width, y + k * r, x + width, y + r);
            ctx.lineTo(x + width, y + height - r);
            ctx.bezierCurveTo(x + width, y + height - k * r, x + width - k * r, y + height, x + width - r, y + height);
            ctx.lineTo(x + r, y + height);
            ctx.bezierCurveTo(x + k * r, y + height, x, y + height - k * r, x, y + height - r);
            ctx.lineTo(x, y + r);
            ctx.bezierCurveTo(x, y + k * r, x + k * r, y, x + r, y);
        } else {
            ctx.rect(x, y, width, height);
        }
        ctx.closePath();
    },

    drawCustomBackground: function (ctx, canvas) {
        // Get the background objects.
        var objects = this.getBackgroundObjects();
        if (objects.length === 0) {
            return;
        }

        // Draw the background objects with product outline as the clip.
        ctx.save();
        this.drawProductOutline(ctx, canvas, true);

        ctx.clip();
        ctx.transform.apply(ctx, canvas.viewportTransform);

        objects.forEach(function (object) {
            object.render(ctx);
        });

        ctx.restore();
    },

    drawCustomOverlay: function (ctx, canvas) {
        // For the case of negative margins (borderless printing), the content
        // obscures the outline of the product. We draw the model outline one more
        // time here after all content has drawn.
        // This function lifts code from clipCanvas function's model outline drawing.

        if (!this.hasNegativeMargins()) {
            return;
        }

        var maskArea = this.getMaskArea();

        var rr = canvas.viewportTransform[0];

        // The "mask" object if present, determines the model outline.
        if (maskArea) {
            var stroke = 'black';
            var strokeWidth = 1 / rr;
            var fill = false;

            this.drawClipArea(ctx, maskArea, stroke, strokeWidth, [], fill, canvas);
        } else {
            // Otherwise, we just draw the canvas outline.
            var data = this.productSizeData;

            ctx.save();
            ctx.beginPath();
            ctx.transform.apply(ctx, canvas.viewportTransform);

            var strokeWidth = 1 / rr;
            this.roundedRect(ctx, strokeWidth / 2, strokeWidth / 2, data.widthMM - strokeWidth, data.heightMM - strokeWidth, 0);

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1 / rr;
            ctx.stroke();

            ctx.restore();
        }
    },

    initialize: function (productModelData) {
        Designer.AppData.productModelData = productModelData;
        this.productSizeData = {
            widthMM: productModelData.productWidth,
            heightMM: productModelData.productHeight,
            leftMarginMM: productModelData.leftMargin,
            rightMarginMM: productModelData.rightMargin,
            topMarginMM: productModelData.topMargin,
            bottomMarginMM: productModelData.bottomMargin
        };
        this.productImagePath = productModelData.modelThumbPath;
        this.productBackgroundColor = productModelData.backgroundColor;
    },

    getProductSizeData: function () {
        return this.productSizeData;
    },

    clear: function () {
        var canvas = this.canvas;

        // Wipe clean the canvas.
        canvas?.clear();

        // Clear the preview canvas.
        this.previewCanvas?.clear();
    },

    writeCanvasClipToSVG: function () {
        var maskArea = this.getMaskArea(),
            marginArea = this.getMarginArea();

        var markup = [];
        if (maskArea && !this.hasNegativeMargins()) {
            markup.push('<clipPath id="svgmask">');
            maskArea.set('visible', true);
            markup.push(maskArea.toSVG());
            maskArea.set('visible', false);

            markup.push('</clipPath>');
        }

        if (marginArea) {
            markup.push('<clipPath id="svgmargin">');
            marginArea.set('visible', true);
            markup.push(marginArea.toSVG());
            marginArea.set('visible', false);

            markup.push('</clipPath>');
        }
        return markup.join('');
    },

    getCanvasClipId: function () {
        var clipIds = [];

        var maskArea = this.getMaskArea(),
            marginArea = this.getMarginArea();

        if (maskArea && !this.hasNegativeMargins()) {
            clipIds.push('svgmask');
        }
        if (marginArea) {
            clipIds.push('svgmargin');
        }
        return clipIds;
    },

    getSVG: function (options) {
        var canvas = this.canvas;

        canvas.writeCanvasClipPathToSVG = null;
        canvas.getCanvasClipPathSVGId = null;

        var me = this;
        if (options.emitCanvasClip) {
            // Set the canvas clip SVG writing callback.
            canvas.writeCanvasClipPathToSVG = function () {
                return me.writeCanvasClipToSVG();
            };
            canvas.getCanvasClipPathSVGId = function () {
                return me.getCanvasClipId();
            };
        }

        var maskArea = this.getMaskArea(),
            marginArea = this.getMarginArea();

        var clipartImages,
            backgroundColor;

        if (maskArea) {
            maskArea.excludeFromExport = options.emitCanvasClip;
        }

        if (marginArea) {
            marginArea.excludeFromExport = options.emitCanvasClip;
        }

        var svgViewBox = this.getSVGViewBox();
        var svgOptions = {
            viewBox: {
                x: svgViewBox.left,
                y: svgViewBox.top,
                width: svgViewBox.width,
                height: svgViewBox.height
            },
            width: svgViewBox.width.toString() + 'mm',
            height: svgViewBox.height.toString() + 'mm',
            suppressPreamble: true
        };

        canvas.closeSVGEditing();

        var svg = canvas.toSVG(svgOptions);

        // Remove the callbacks.
        canvas.writeCanvasClipPathToSVG = null;
        canvas.getCanvasClipPathSVGId = null;
        canvas.writeObjectClipPathsToSVG = null;
        canvas.getObjectClipPathSVGId = null;
        canvas.getUseFilteredImage = null;

        // Restore background color.
        if (clipartImages) {
            for (var i = 0, len = clipartImages.length; i < len; i++) {
                var filter = this.getImageFilter(clipartImages[i], 'Tint');
                filter.color = backgroundColor;
                clipartImages[i].applyFilters();
            }
        }

        return svg;
    },

    getThumbnail: function () {
        var canvas = this.canvas;

        // We are drawing for preview.
        this.drawingPreview = true;

        if (this.currentZoomLevel != 1) {
            this.transformCanvasViewport();
        }

        canvas.renderAll();

        var img = canvas.toDataURL({
            format: 'jpg',
            left: this.canvasX,
            top: this.canvasY,
            width: this.canvasWidth,
            height: this.canvasHeight
        });

        this.drawingPreview = false;
        if (this.currentZoomLevel != 1) {
            this.transformCanvasViewport();
        }
        canvas.renderAll();

        return img;
    },

    objectIterator: function (ob, cb, key = "objects") {
        function iterator(obj) {
            if (cb(obj)) {
                return true;
            }
            if (!obj[key]) {
                return;
            }
            for (let o of obj[key]) {
                if (cb(o) || iterator(o)) {
                    return true;
                }
            }
        }
        cb && iterator(ob);
    },

    loadProductDesignJSON: async function (json, page) {
        var canvas = this.canvas;

        // When opening a product model in product designer, we designate the product model
        // objects as background. These are made un-selectable, and therefore cannot be modified.
        // Foreground objects (created in product designer) can not be sent beneath background.

        var maskArea = false,
            marginArea = false,
            me = this;


        // Get the product design and load.
        return await new Promise(function (resolve) {
            canvas.loadFromJSON(
                json,
                function () { // callback
                    var objects = canvas.getObjects();

                    if (maskArea || marginArea) {
                        // Do away with the default margin area.
                        if (objects[0].get('id') == 'margin') {
                            canvas.remove(objects[0]);
                        }
                    }

                    // Set the lowest modifiable object index.
                    var productModel = Designer.AppData.productModelData;
                    var userBackground = productModel.userBackground || 'on';
                    if (userBackground == 'on') {
                        canvas.lowestFgObjectIndex = me.getBGColorObjectIndex();
                    } else {
                        canvas.lowestFgObjectIndex = canvas.getObjects().length;
                    }

                    me.transformCanvasViewport();
                    resolve();
                },
                function (o, object, index) { // reviver
                    if (!object)
                        return;
                    var id = object.get('id');
                    if (id == "authorPhoto" && object._objects) {
                        page.imageBoxes = object._objects.filter(o => o.type == 'imageBox');
                    }
                }
            );
        });
    },

    allowObjectMove: function (object, newLeft, newTop) {
        // If the object is moving too much outside the parent bounds, disallow move.
        // Object area must be within the tolerance limit of the parent or 50% the
        // object size (whichever is smaller).

        var oldLeft = object.get('left');
        var oldTop = object.get('top');

        // Get the updated object bounds.
        object.set('left', newLeft);
        object.set('top', newTop);

        // The canvas bounds.
        var data = this.getProductMargins();
        canvasBounds = {
            left: data.leftMarginMM,
            top: data.topMarginMM,
            right: data.widthMM - data.rightMarginMM,
            bottom: data.heightMM - data.bottomMarginMM,
            sideTolerance: 0.05,
            areaTolerance: 0.01
        };
        canvasBounds.width = canvasBounds.right - canvasBounds.left;
        canvasBounds.height = canvasBounds.bottom - canvasBounds.top;

        var objects = [];
        var isActiveGroup = false;

        if (object.get('type') == 'activeSelection') {
            objects = object.getObjects();
            isActiveGroup = true;
        } else {
            objects.push(object);
        }

        var canvas = this.canvas;
        var originalProperties = [];
        var allowMove = true;

        for (var i = 0, length = objects.length; i < length; i++) {
            var parentBounds = canvasBounds;
            if (isActiveGroup) {
                originalProperties.push(canvas._realizeGroupTransformOnObject(objects[i]));
            }

            var coords = objects[i].calcCoords(true);

            if ((objects[i].angle % 90) === 0) {
                // Orthogonal rotation case.
                var objectBounds = {
                    left: Math.min(coords.tl.x, coords.tr.x, coords.bl.x, coords.br.x),
                    top: Math.min(coords.tl.y, coords.tr.y, coords.bl.y, coords.br.y),
                    right: Math.max(coords.tl.x, coords.tr.x, coords.bl.x, coords.br.x),
                    bottom: Math.max(coords.tl.y, coords.tr.y, coords.bl.y, coords.br.y)
                };
                objectBounds.width = objectBounds.right - objectBounds.left;
                objectBounds.height = objectBounds.bottom - objectBounds.top;

                // Find the intersection of object and parent bounds.
                var intersect = this.intersectRect(parentBounds, objectBounds);

                if (intersect) {
                    var minWidth = Math.min(0.5 * objectBounds.width, parentBounds.sideTolerance * parentBounds.width);
                    var minHeight = Math.min(0.5 * objectBounds.height, parentBounds.sideTolerance * parentBounds.height);

                    if (intersect.width >= minWidth && intersect.height >= minHeight) {
                        continue;
                    }
                }

                allowMove = false;
                break;
            } else {
                var points = [];

                // For non orthogonal rotation cases, we compute the intersection of the parent
                // with the object polygon (quad), and ensure that the intersection area is above
                // a particular threshold - 1% of the canvas or 10% of the editArea.
                // Below we implement the algorithm to find the intersection area.
                // https://math.stackexchange.com/questions/141798/two-quadrilaterals-intersection-area-special-case

                // First, check if the object is fully contained in the parent.
                var containsTL = this.pointInRect(coords.tl, parentBounds, points);
                var containsTR = this.pointInRect(coords.tr, parentBounds, points);
                var containsBL = this.pointInRect(coords.bl, parentBounds, points);
                var containsBR = this.pointInRect(coords.br, parentBounds, points);

                if (containsTL && containsTR && containsBL && containsBR) {
                    continue;
                }

                // Check if the object completely overlaps the parent.
                var lines = this.getLines(coords);

                var point = new fabric.Point(parentBounds.left, parentBounds.top);
                containsTL = objects[i].containsPoint(point, lines);
                if (containsTL) {
                    points.push(point);
                }

                point = new fabric.Point(parentBounds.right, parentBounds.top);
                containsTR = objects[i].containsPoint(point, lines);
                if (containsTR) {
                    points.push(point);
                }

                point = new fabric.Point(parentBounds.left, parentBounds.bottom);
                containsBL = objects[i].containsPoint(point, lines);
                if (containsBL) {
                    points.push(point);
                }

                point = new fabric.Point(parentBounds.right, parentBounds.bottom);
                containsBR = objects[i].containsPoint(point, lines);
                if (containsBR) {
                    points.push(point);
                }

                if (containsTL && containsTR && containsBL && containsBR) {
                    continue;
                }

                // Else compute the intersection area.
                var intersection =
                    fabric.Intersection.intersectPolygonRectangle(this.getCoordsArray(coords),
                        new fabric.Point(parentBounds.left, parentBounds.top),
                        new fabric.Point(parentBounds.right, parentBounds.bottom));
                if (intersection.points.length === 0) {
                    allowMove = false;
                    break;
                }

                points.push.apply(points, intersection.points);

                // Sort the intersection area points.
                this.sortPolygonPoints(points);

                // Find its area.
                var area = this.computePolygonArea(points);

                // If the intersection area is within the tolerance of the parent object.
                if (area > parentBounds.areaTolerance * parentBounds.width * parentBounds.height) {
                    continue;
                }

                allowMove = false;
                break;
            }
        }

        if (isActiveGroup) {
            for (var i = 0, length = originalProperties.length; i < length; i++) {
                canvas._unwindGroupTransformOnObject(objects[i], originalProperties[i]);
            }
        }

        object.set('left', oldLeft);
        object.set('top', oldTop);

        return allowMove;
    },

    sortPolygonPoints: function (points) {
        var center = this.findPolygonCenter(points);
        points.sort(function (a, b) {
            if (a.x - center.x >= 0 && b.x - center.x < 0)
                return 1;
            if (a.x - center.x < 0 && b.x - center.x >= 0)
                return -1;
            if (a.x - center.x === 0 && b.x - center.x === 0) {
                if (a.y - center.y >= 0 || b.y - center.y >= 0)
                    return a.y > b.y ? 1 : -1;
                return b.y > a.y ? -1 : 1;
            }

            // compute the cross product of vectors (center -> a) x (center -> b)
            var det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
            if (det < 0)
                return -1;
            if (det > 0)
                return 1;

            // points a and b are on the same line from the center
            // check which point is closer to the center
            var d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
            var d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
            return d1 > d2 ? 1 : -1;
        });
    },

    findPolygonCenter: function (points) {
        var sx = points[0].x,
            sy = points[0].y;

        for (var i = 1, length = points.length; i < length; i++) {
            sx += points[i].x;
            sy += points[i].y;
        }

        return new fabric.Point(sx / points.length, sy / points.length);
    },

    computePolygonArea: function (points) {
        // Computes the area using shoelace method.
        var area = 0;  // Accumulates area in the loop'
        var length = points.length;

        var j = length - 1;  // The last vertex is the 'previous' one to the first

        for (var i = 0; i < length; i++) {
            area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
            j = i;  // j is previous vertex to i
        }

        return Math.abs(area / 2);
    },

    getLines: function (coords) {
        return {
            topline: {
                o: coords.tl,
                d: coords.tr
            },
            rightline: {
                o: coords.tr,
                d: coords.br
            },
            bottomline: {
                o: coords.br,
                d: coords.bl
            },
            leftline: {
                o: coords.bl,
                d: coords.tl
            }
        };
    },

    getCoordsArray: function (coords) {
        return [
            new fabric.Point(coords.tl.x, coords.tl.y),
            new fabric.Point(coords.tr.x, coords.tr.y),
            new fabric.Point(coords.br.x, coords.br.y),
            new fabric.Point(coords.bl.x, coords.bl.y)
        ];
    },

    intersectRect: function (r1, r2) {
        var intersect = !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);

        if (!intersect) {
            return false;
        }

        // Return the intersection bounds.
        intersect = {
            left: Math.max(r1.left, r2.left),
            right: Math.min(r1.right, r2.right),
            top: Math.max(r1.top, r2.top),
            bottom: Math.min(r1.bottom, r2.bottom)
        };

        intersect.width = intersect.right - intersect.left;
        intersect.height = intersect.bottom - intersect.top;

        return intersect;
    },

    pointInRect: function (p, r, points) {
        var contains = (r.left <= p.x && p.x <= r.right &&
            r.top <= p.y && p.y <= r.bottom);

        if (contains && points) {
            points.push(new fabric.Point(p.x, p.y));
        }

        return contains;
    },

    getMaskArea: function () {
        var canvas = this.canvas;
        var objects = canvas.getObjects();

        // No need to iterate over all objects.
        // "mask" object if present, is always the first object.
        if (objects.length !== 0 && objects[0].id == "mask") {
            return objects[0];
        }
    },

    getMarginArea: function () {
        var canvas = this.canvas;
        var objects = canvas.getObjects();

        // No need to iterate over all objects.
        // "margin" object if present, is either the first or second object.
        if (objects.length !== 0 && objects[0].id == "margin") {
            return objects[0];
        }

        if (objects.length > 1 && objects[1].id == "margin") {
            return objects[1];
        }
    },

    drawClipArea: function (ctx, clipArea, stroke, strokeWidth, strokeDashArray, fill, canvas) {
        // Since the fabric canvas.clipTo is called without the canvas viewport transform
        // in place, we take care of the canvas scaling here.
        ctx.save();
        ctx.beginPath();
        ctx.transform.apply(ctx, canvas.viewportTransform);

        if (stroke) {
            clipArea.set('strokeWidth', strokeWidth);
        }

        // Draw the clip area. This also leaves the clip path stroke in ctx, which
        // gets set as the canvas clip on return from this function.
        clipArea.set('visible', true);
        clipArea.render(ctx);
        clipArea.set('visible', false);

        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }

        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;
            ctx.setLineDash(strokeDashArray);
            ctx.stroke();
        }

        ctx.restore();
    },

    getBackgroundObjects: function () {
        var objects = this.canvas.getObjects();
        var bgObjects = [];

        objects.forEach(function (object) {
            if (object.get('id') == 'background') {
                bgObjects.push(object);
            }
        });

        return bgObjects;
    },

    getBGColorObjectIndex: function () {
        // Add background color object just after the mask/margin objects.
        var index = -1;

        var mask = this.getMaskArea();
        if (mask) {
            index++;
        }

        var margin = this.getMarginArea();
        if (margin) {
            index++;
        }

        return index + 1;
    },

    getProductMargins: function () {
        var data = this.getProductSizeData();

        // If we have a margin area, return its bounds for the margins.
        var marginArea = this.getMarginArea();

        // Margin area can be a fabric group (from SVG), or a rect object (if default).
        if (marginArea) {
            if (marginArea.get('type') == 'group') {
                // SVG margin area.
                var bounds = this.getPathGroupBoundingRect(marginArea);

                var leftMargin = bounds.left;
                var topMargin = bounds.top;
                var rightMargin = data.widthMM - (bounds.left + bounds.width);
                var bottomMargin = data.heightMM - (bounds.top + bounds.height);
                return {
                    widthMM: data.widthMM,
                    heightMM: data.heightMM,
                    leftMarginMM: leftMargin,
                    topMarginMM: topMargin,
                    rightMarginMM: rightMargin,
                    bottomMarginMM: bottomMargin
                };
            } else {
                // The default margins.
                return data;
            }
        }

        // If we have a mask area, return its bounds for the margins.
        var maskArea = this.getMaskArea();

        // Mask area is a fabric group (from SVG).
        if (maskArea && maskArea.get('type') == 'group') {
            // SVG mask area.
            var bounds = this.getPathGroupBoundingRect(maskArea);
            return {
                widthMM: data.widthMM,
                heightMM: data.heightMM,
                leftMarginMM: bounds.left,
                topMarginMM: bounds.top,
                rightMarginMM: data.widthMM - (bounds.left + bounds.width),
                bottomMarginMM: data.heightMM - (bounds.top + bounds.height)
            };
        }

        // Otherwise, return the product size data itself.
        return data;
    },

    getProductBounds: function () {
        var data = this.getProductMargins();

        return {
            left: data.leftMarginMM,
            top: data.topMarginMM,
            width: data.widthMM - data.leftMarginMM - data.rightMarginMM,
            height: data.heightMM - data.topMarginMM - data.bottomMarginMM
        };
    },

    getPathGroupBoundingRect: function (pathGroup) {
        var groupBounds;
        var objects = pathGroup.getObjects();

        for (var i = 0, length = objects.length; i < length; i++) {
            var objectBounds = this.getGroupChildBoundingRect(objects[i]);

            objectBounds.right = objectBounds.left + objectBounds.width;
            objectBounds.bottom = objectBounds.top + objectBounds.height;

            if (!groupBounds) {
                groupBounds = objectBounds;
            } else {
                groupBounds = this.getUnionBounds(groupBounds, objectBounds);
            }
        }

        return groupBounds;
    },

    getGroupChildBoundingRect: function (object) {
        var matrix = object.calcTransformMatrix();
        var options = fabric.util.qrDecompose(matrix);

        var translateMatrix = [1, 0, 0, 1, options.translateX, options.translateY];
        var rotateMatrix = fabric.iMatrix.concat();
        if (options.angle) {
            var theta = fabric.util.degreesToRadians(options.angle),
                cos = Math.cos(theta),
                sin = Math.sin(theta);
            rotateMatrix = [cos, sin, -sin, cos, 0, 0];
        }

        var finalMatrix = fabric.util.multiplyTransformMatrices(translateMatrix, rotateMatrix);

        var transformPoint = fabric.util.transformPoint;
        var p = object._getNonTransformedDimensions(),
            matrix = fabric.util.customTransformMatrix(options.scaleX, options.scaleY, options.skewX),
            dim = transformPoint(p, matrix),
            w = dim.x / 2,
            h = dim.y / 2,
            tl = transformPoint({ x: -w, y: -h }, finalMatrix),
            tr = transformPoint({ x: w, y: -h }, finalMatrix),
            bl = transformPoint({ x: -w, y: h }, finalMatrix),
            br = transformPoint({ x: w, y: h }, finalMatrix);

        // corners
        var points = [
            new fabric.Point(tl.x, tl.y),
            new fabric.Point(tr.x, tr.y),
            new fabric.Point(br.x, br.y),
            new fabric.Point(bl.x, bl.y)
        ];

        return fabric.util.makeBoundingBoxFromPoints(points);
    },

    getSVGViewBox: function () {
        return this.getProductBounds();
    },

    hasNegativeMargins: function () {
        var data = this.productSizeData;

        return (data.leftMarginMM < 0 || data.topMarginMM < 0 ||
            data.rightMarginMM < 0 || data.bottomMarginMM < 0);
    },

    setZoom: function (zoomLevel) {
        this.previewCanvasHidden = (zoomLevel <= 1);
        this.currentZoomLevel = zoomLevel;
        this.canvas.zoomLevel = this.currentZoomLevel;
        if (!this.productSizeData) {
            return
        }

        // Trigger canvas re-layouting.
        this.recalcCanvasLayout();
        this.updatePreviewCanvasLabel();
    },

    getZoom: function () {
        return this.currentZoomLevel;
    },

    showHidePreviewCanvas: function (show) {
        this.previewCanvasHiddenOverride = !show;
        this.previewCanvasContainer.style.visibility = (!show ? 'hidden' : 'visible');
        this.updatePreviewCanvasLabel();
    },

    isPreviewCanvasShown: function () {
        return !this.previewCanvasHiddenOverride;
    },

    updatePreviewCanvasLabel: function () {
        // Display the current zoom level.
        if (this.previewCanvasLabel) {
            this.previewCanvasLabel.textContent = "ZOOM LEVEL: " + this.currentZoomLevel + 'x';
        }
    },

    getImageFilter: function (imageObject, filterType) {
        var appliedFilters = imageObject.filters;
        for (var i = 0, length = appliedFilters.length; i < length; i++) {
            if (appliedFilters[i].type == filterType) {
                return appliedFilters[i];
            }
        }
    },

    onCanvasPanelAfterRender: async function (containerElement) {
        this.view.container = containerElement;
        var canvasElement = containerElement.getElementsByClassName('mainCanvas')[0];
        var previewCanvasContainer = containerElement.getElementsByClassName('previewCanvasContainer')[0];

        var previewCanvasElement = previewCanvasContainer.getElementsByClassName('previewCanvas')[0];
        var panCanvasElement = previewCanvasContainer.getElementsByClassName('panCanvas')[0];
        var previewCanvasLabel = previewCanvasContainer.getElementsByClassName('previewCanvasLabel')[0];

        // Create the fabric.js canvas object.
        var canvas = new fabric.LayeredCanvas(canvasElement);
        var previewCanvas = new fabric.StaticCanvas(previewCanvasElement);
        var panCanvas = new fabric.LayeredCanvas(panCanvasElement);

        // Stash the fabric canvas off the controller.
        this.canvas = canvas;
        this.previewCanvas = previewCanvas;
        this.panCanvas = panCanvas;

        await this.setCanvasAttributes(canvas, previewCanvas, panCanvas);

        this.previewCanvasContainer = previewCanvasContainer;
        this.previewCanvasLabel = previewCanvasLabel;

        this.mainToPreviewCanvasSizeRatio = 4;
        this.currentZoomLevel = 1;
        this.previewCanvasHidden = (this.currentZoomLevel <= 1);
    },

    loadDesign: function (json, page) {
        var canvas = this.canvas;
        var data = this.productSizeData;
        window.loading(true);
        return this.loadProductDesignJSON(json, page).then(function () {
            canvas.fire('canvas:x-ready', data);
            window.loading(false);
        })
    }
};

fabric.util.customTransformMatrix = function (scaleX, scaleY, skewX) {
    let abs = Math.abs,
        skewMatrixX = [1, 0, abs(Math.tan(skewX * Math.PI / 180)), 1],
        scaleMatrix = [abs(scaleX), 0, 0, abs(scaleY)];
    return fabric.util.multiplyTransformMatrices(scaleMatrix, skewMatrixX, true);
};

window.global.Designer = Designer;
window.global.fabric = fabric;
window.global.lozad = lozad;

fabric.Canvas.prototype.getLayerById = function (id) {
    return this.getObjects().find(i => i.id === id);
}
fabric.Canvas.prototype.addToContentsLayer = function (obj) {
    let contentsLayer = this.getLayerById('contents');
    if (contentsLayer) {
        contentsLayer.add(obj);
    }
};
fabric.Canvas.prototype.addToBackgroundLayer = function (obj) {
    let backgroundLayer = this.getLayerById('background');
    if (backgroundLayer) {
        backgroundLayer.add(obj);
    }
};
fabric.ShapedText.prototype.strokeMiterLimit = 3;
fabric.ShapedText.prototype.emitExtraStroke = function (stroke) {
    var styles = [
        this.getStrokeStyle(stroke),
        ' stroke-linejoin: ', this.strokeLineJoin, '; ',
        ' stroke-miterlimit: ', this.strokeMiterLimit
    ];
    var res = 'style="' + styles.join('') + '" ';
    if (stroke.sepName) {
        res += 'data-sep-name="' + stroke.sepName + '" ';
    }
    return res;
};
fabric.Object.prototype.emitNormal = function (common) {
    if (this.sepName) {
        common.push('data-sep-name="' + this.sepName + '" ');
    }
    return common.join('');
};

let toObject = fabric.Object.prototype.toObject;
fabric.Object.prototype.toObject = function (propertiesToInclude) {
    var additionalProperties = [
        'id',
        'selectable',
        'evented',
        'isLocked',
        'hasControls',
        'undeletable',
        'filePath',
        'thumbPath',
        'sepName',
        'lockColor',
        'excludeSVGExport'
    ].concat(propertiesToInclude || []);
    return toObject.call(this, additionalProperties);
};

fabric.Svg.prototype.name = "Clipart";
fabric.Path.prototype.name = 'Clipart';
fabric.Polygon.prototype.name = 'Clipart';
fabric.Rect.prototype.name = 'Clipart';
fabric.Circle.prototype.name = 'Clipart';
fabric.ShapedText.prototype.name = "Text";

fabric.Text.prototype.enableGrammarly = true;

var getSrc = fabric.Image.prototype.getSrc;
fabric.Image.prototype.getSrc = function () {
    var src = getSrc.apply(this, arguments);
    return src.replace(/.*?designer/, '/designer');
};
fabric.ShapedText.prototype.originX = 'center';
fabric.ShapedText.prototype.originY = 'center';

var getSvgSrc = fabric.Image.prototype.getSvgSrc;
fabric.Image.prototype.getSvgSrc = function () {
    var src = getSvgSrc.apply(this, arguments).replaceAll("&", "&amp;");
    return src.replace('/thumbs/', '/');
};

fabric.Image.prototype.getSvgThumbSrc = function () {
    return getSvgSrc.apply(this, arguments).replaceAll("&", "&amp;");
};

fabric.Image.prototype._toSVG = function () {
    var svgString = [], imageMarkup = [], strokeSvg, element = this._element,
        x = -this.width / 2, y = -this.height / 2, clipPath = '', imageRendering = '';
    if (!element) {
        return [];
    }
    if (this.hasCrop()) {
        var clipPathId = fabric.Object.__uid++;
        svgString.push(
            '<clipPath id="imageCrop_' + clipPathId + '">\n',
            '\t<rect x="' + x + '" y="' + y + '" width="' + this.width + '" height="' + this.height + '" />\n',
            '</clipPath>\n'
        );
        clipPath = ' clip-path="url(#imageCrop_' + clipPathId + ')" ';
    }
    if (!this.imageSmoothing) {
        imageRendering = '" image-rendering="optimizeSpeed';
    }
    imageMarkup.push('\t<image ', 'COMMON_PARTS', 'xlink:href="', this.getSvgSrc(true),
        '" x="', x - this.cropX, '" y="', y - this.cropY,
        '" width="', element.width || element.naturalWidth,
        '" height="', element.height || element.height,
        imageRendering,
        '" data-thumb-path="', this.getSvgThumbSrc(),
        '"', clipPath,
        '></image>\n');

    if (this.stroke || this.strokeDashArray) {
        var origFill = this.fill;
        this.fill = null;
        strokeSvg = [
            '\t<rect ',
            'x="', x, '" y="', y,
            '" width="', this.width, '" height="', this.height,
            '" style="', this.getSvgStyles(),
            '"/>\n'
        ];
        this.fill = origFill;
    }
    if (this.paintFirst !== 'fill') {
        svgString = svgString.concat(strokeSvg, imageMarkup);
    }
    else {
        svgString = svgString.concat(imageMarkup, strokeSvg);
    }
    return svgString;
}

const fromObject = fabric.Image.fromObject;
fabric.Image.fromObject = function (_object, callback) {
    _object.crossOrigin = "anonymous";
    fromObject(_object, callback);
};

const fromURL = fabric.Image.fromURL;
fabric.Image.fromURL = function (url, callback, imgOptions = {}) {
    imgOptions.crossOrigin = "anonymous";
    fromURL(url, callback, imgOptions);
};

const imageHolderfromObject = fabric.ImageHolder.fromObject;
fabric.ImageHolder.fromObject = function (_object, callback) {
    _object.crossOrigin = "anonymous";
    imageHolderfromObject(_object, callback);
};

const imageBoxfromObject = fabric.ImageBox.fromObject;
fabric.ImageBox.fromObject = function (_object, callback) {
    _object.crossOrigin = "anonymous";
    imageBoxfromObject(_object, callback);
};


delete fabric.Textbox.prototype.controls.bl;
delete fabric.Textbox.prototype.controls.br;
delete fabric.Textbox.prototype.controls.tm;
delete fabric.Textbox.prototype.controls.bm;
delete fabric.Textbox.prototype.controls.mt;
delete fabric.Textbox.prototype.controls.mb;
delete fabric.Textbox.prototype.controls.mr;
delete fabric.Textbox.prototype.controls.ml;
fabric.Layer.prototype.objectCaching = false;

fabric.TextArea.prototype.maxWarningHeight = 296;