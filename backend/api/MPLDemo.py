# Python3 interactive visual demo template using matplotlib
# requires: python3.6, numpy, matplotlib, PyQt5
# Written by Alex Gepperth, 2022.
import numpy as np, matplotlib.pyplot as plt, math, sys ;

# parent class: constructor with argument loop_forever

class MPLDemo(object):
  def __init__(self, **kwargs):
    self.prepare_demo(**kwargs) ;
    if kwargs.get("blocking", True) == True:
      # infinite event loop, equivalent to plt.show()
      while True:
        plt.pause(0.01) ;

  """
  Here, we: a) instantiate figures and axes b) connect events via 
  fig.canvas.mpl_connect() to methods we create ourselves
  and c) do other stuff to prepare out demo
  """
  def prepare_demo(self, **kwargs):
    # This is just an example for c&p!

    # adapt number of subplots if u want
    self.fig,self.ax = plt.subplots(1,1) ;
    
    # register callback for clicks on axis
    self.fig.canvas.mpl_connect('button_press_event', self.onclick)
    
    # call the callback once with a None argument to set up an initial visual display
    self.onclick(None) ;
    plt.draw() ;
    plt.pause(0.01) ;
    pass ;

  # just an example!
  def onclick(self,e):
    pass ;

  # ADDED: called by demo wrapper to access the demo's figure
  def getFig(self):
      return self.fig



