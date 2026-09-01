import 'dart:html' as html;
import 'dart:ui_web' as ui_web;

import 'package:flutter/material.dart';

const _viewType = 'blazebyte-complete-site';

void main() {
  ui_web.platformViewRegistry.registerViewFactory(_viewType, (int viewId) {
    return html.IFrameElement()
      ..src = 'site/index.html'
      ..title = 'BlazeByte Studio'
      ..setAttribute('allow', 'autoplay; fullscreen')
      ..setAttribute('aria-label', 'BlazeByte Studio website')
      ..style.border = '0'
      ..style.width = '100%'
      ..style.height = '100%'
      ..style.display = 'block';
  });

  runApp(const BlazeByteApp());
}

class BlazeByteApp extends StatelessWidget {
  const BlazeByteApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'BlazeByte Studio',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xff070219),
      ),
      home: const Scaffold(
        body: SizedBox.expand(
          child: HtmlElementView(viewType: _viewType),
        ),
      ),
    );
  }
}
